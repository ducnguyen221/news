/* AI News — animated tech background (same effect as ducnguyen.vn home).
   Self-contained: creates its own fixed <canvas> behind the page content.
   Include with: <script src=".../assets/bg.js" defer></script> */
(function () {
  if (document.getElementById("aiCanvas")) return;
  var canvas = document.createElement("canvas");
  canvas.id = "aiCanvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;z-index:-1;width:100%;height:100%;pointer-events:none;opacity:.65";
  document.body.prepend(canvas);

  // A negative-z canvas paints below the body's own background. Move the page
  // gradient up to <html> and clear body's, so the canvas sits between the
  // background and the content on every page regardless of its structure.
  var cs = window.getComputedStyle(document.body);
  if (cs.backgroundImage !== "none" || cs.backgroundColor !== "rgba(0, 0, 0, 0)") {
    document.documentElement.style.backgroundColor = cs.backgroundColor;
    document.documentElement.style.backgroundImage = cs.backgroundImage;
    document.documentElement.style.backgroundAttachment = "fixed";
    document.body.style.background = "transparent";
  }

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pointer = { x: 0, y: 0, active: false };
  var hud = { x: 0, y: 0 };
  var width = 0, height = 0, particles = [], rafId = 0;

  function resize() {
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    var count = Math.min(75, Math.max(30, Math.floor((width * height) / 24000)));
    particles = Array.from({ length: count }, function (_, index) {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 1.0 + Math.random() * 1.5,
        hue: index % 3
      };
    });
  }

  function colorFor(hue, alpha) {
    if (hue === 0) return "rgba(0, 240, 255, " + alpha + ")";
    if (hue === 1) return "rgba(189, 0, 255, " + alpha + ")";
    return "rgba(57, 255, 20, " + alpha + ")";
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(function (p) {
      if (!reduceMotion) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (pointer.active) {
          var dx = pointer.x - p.x, dy = pointer.y - p.y;
          var distance = Math.hypot(dx, dy);
          if (distance < 160) { p.x += dx * 0.001; p.y += dy * 0.001; }
        }
      }
    });

    for (var i = 0; i < particles.length; i += 1) {
      for (var j = i + 1; j < particles.length; j += 1) {
        var a = particles[i], b = particles[j];
        var ddx = a.x - b.x, ddy = a.y - b.y;
        var dist2 = Math.hypot(ddx, ddy);
        if (dist2 < 120) {
          var alpha = (1 - dist2 / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          var grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, colorFor(a.hue, alpha));
          grad.addColorStop(1, colorFor(b.hue, alpha));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = colorFor(p.hue, 0.7);
      ctx.fill();
    });

    if (pointer.active && !reduceMotion) {
      hud.x += (pointer.x - hud.x) * 0.08;
      hud.y += (pointer.y - hud.y) * 0.08;
      var time = Date.now() * 0.001;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hud.x, hud.y, 25, time, time + Math.PI * 1.5);
      ctx.stroke();
      ctx.strokeStyle = "rgba(189, 0, 255, 0.12)";
      ctx.beginPath();
      ctx.arc(hud.x, hud.y, 35, -time * 0.8, -time * 0.8 + Math.PI * 0.8);
      ctx.stroke();
      ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(hud.x, hud.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0, 240, 255, 0.4)";
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillText("LOC: [" + Math.round(hud.x) + ", " + Math.round(hud.y) + "]", hud.x + 45, hud.y + 4);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
      ctx.beginPath();
      ctx.moveTo(hud.x + 40, hud.y - 4);
      ctx.lineTo(hud.x + 42, hud.y - 4);
      ctx.lineTo(hud.x + 42, hud.y + 8);
      ctx.lineTo(hud.x + 40, hud.y + 8);
      ctx.stroke();
    }

    rafId = window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", function (event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", function () { pointer.active = false; });
  window.addEventListener("pagehide", function () { window.cancelAnimationFrame(rafId); });

  resize();
  draw();
})();
