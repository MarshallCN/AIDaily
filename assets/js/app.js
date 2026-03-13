(function () {
  document.addEventListener("DOMContentLoaded", function () {
    initSignalCanvas();
    initNewsReader();
  });

  function initNewsReader() {
    var dataNode = document.getElementById("news-data");
    if (!dataNode) {
      return;
    }

    var posts = [];

    try {
      posts = JSON.parse(dataNode.textContent || "[]");
    } catch (error) {
      console.error("Failed to parse news data", error);
      return;
    }

    if (!posts.length) {
      return;
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll(".news-card"));
    var searchInput = document.getElementById("search-input");
    var searchEmpty = document.getElementById("search-empty");
    var articleDate = document.getElementById("article-date");
    var articleTags = document.getElementById("article-tags");
    var articleTitle = document.getElementById("article-title");
    var articleSummary = document.getElementById("article-summary");
    var articleContent = document.getElementById("article-content");
    var articleLink = document.getElementById("article-link");
    var bySlug = new Map();
    var activeSlug = null;

    posts.forEach(function (post) {
      bySlug.set(post.slug, post);
    });

    cards.forEach(function (card) {
      card.addEventListener("click", function (event) {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        var slug = card.dataset.slug;
        if (slug) {
          window.location.hash = encodeURIComponent(slug);
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", function (event) {
        filterCards(event.target.value || "");
      });
    }

    window.addEventListener("hashchange", function () {
      syncFromHash(false);
    });

    filterCards("");
    syncFromHash(true);

    function filterCards(query) {
      var normalized = String(query).trim().toLowerCase();
      var visibleCards = [];

      cards.forEach(function (card) {
        var post = bySlug.get(card.dataset.slug);
        var searchSource = [
          post.title,
          post.summary,
          post.date,
          Array.isArray(post.tags) ? post.tags.join(" ") : "",
          card.dataset.search || ""
        ]
          .join(" ")
          .toLowerCase();

        var isVisible = !normalized || searchSource.indexOf(normalized) !== -1;
        card.hidden = !isVisible;

        if (isVisible) {
          visibleCards.push(card);
        }
      });

      if (searchEmpty) {
        searchEmpty.hidden = visibleCards.length !== 0;
      }

      if (!visibleCards.length) {
        renderEmptyArticle();
        return;
      }

      if (!activeSlug || !isCardVisible(activeSlug)) {
        var fallbackSlug = visibleCards[0].dataset.slug;
        renderPost(bySlug.get(fallbackSlug));
        updateActiveCard(fallbackSlug);
        return;
      }

      renderPost(bySlug.get(activeSlug));
      updateActiveCard(activeSlug);
    }

    function syncFromHash(isInitial) {
      var slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));

      if (!slug || !bySlug.has(slug) || !isCardVisible(slug)) {
        if (isInitial) {
          var firstVisibleCard = cards.find(function (card) {
            return !card.hidden;
          });

          if (firstVisibleCard) {
            renderPost(bySlug.get(firstVisibleCard.dataset.slug));
            updateActiveCard(firstVisibleCard.dataset.slug);
          }
        }

        return;
      }

      renderPost(bySlug.get(slug));
      updateActiveCard(slug);
    }

    function updateActiveCard(slug) {
      activeSlug = slug;

      cards.forEach(function (card) {
        card.classList.toggle("is-active", card.dataset.slug === slug);
      });
    }

    function isCardVisible(slug) {
      var card = cards.find(function (item) {
        return item.dataset.slug === slug;
      });

      return Boolean(card && !card.hidden);
    }

    function renderPost(post) {
      if (!post || !articleContent) {
        return;
      }

      if (articleDate) {
        articleDate.textContent = post.dateLabel || post.date;
      }

      if (articleTitle) {
        articleTitle.textContent = post.title;
      }

      if (articleSummary) {
        articleSummary.textContent = post.summary || "";
      }

      if (articleLink) {
        articleLink.href = post.url;
      }

      if (articleTags) {
        articleTags.innerHTML = "";

        (post.tags || []).forEach(function (tag) {
          var chip = document.createElement("span");
          chip.textContent = tag;
          articleTags.appendChild(chip);
        });
      }

      articleContent.innerHTML = post.html || "";
      animateArticle(articleContent);
    }

    function renderEmptyArticle() {
      if (articleDate) {
        articleDate.textContent = "--";
      }

      if (articleTitle) {
        articleTitle.textContent = "没有匹配的日报";
      }

      if (articleSummary) {
        articleSummary.textContent = "清空搜索词后，会自动回到最近一篇可见日报。";
      }

      if (articleTags) {
        articleTags.innerHTML = "";
      }

      if (articleLink) {
        articleLink.removeAttribute("href");
      }

      if (articleContent) {
        articleContent.innerHTML =
          '<div class="empty-state empty-state--reader">换个关键词，或者直接新增一篇 Markdown 日报。</div>';
      }
    }

    function animateArticle(container) {
      var blocks = Array.prototype.slice.call(container.children);

      blocks.forEach(function (block, index) {
        block.style.setProperty("--delay", Math.min(index * 55, 385) + "ms");
      });
    }
  }

  function initSignalCanvas() {
    var canvas = document.getElementById("signal-canvas");
    if (!canvas) {
      return;
    }

    var context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    var particles = [];
    var particleCount = 30;
    var animationFrameId = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: particleCount }, function () {
        return createParticle(rect.width, rect.height);
      });
    }

    function createParticle(width, height) {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.6 + Math.random() * 2.5
      };
    }

    function tick() {
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);

      particles.forEach(function (particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= width) {
          particle.vx *= -1;
        }

        if (particle.y <= 0 || particle.y >= height) {
          particle.vy *= -1;
        }
      });

      for (var i = 0; i < particles.length; i += 1) {
        for (var j = i + 1; j < particles.length; j += 1) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            context.strokeStyle = "rgba(255,255,255," + (0.12 - distance / 1200) + ")";
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }

      particles.forEach(function (particle) {
        var gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 5
        );

        gradient.addColorStop(0, "rgba(255,255,255,0.92)");
        gradient.addColorStop(1, "rgba(15,156,165,0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "rgba(255,255,255,0.85)";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(tick);
    }

    resize();
    tick();

    window.addEventListener("resize", function () {
      window.cancelAnimationFrame(animationFrameId);
      resize();
      tick();
    });
  }
})();
