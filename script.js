(() => {
  function setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const parts = document.cookie.split(';');
    for (let i = 0; i < parts.length; i++) {
      let c = parts[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function initInstagram() {
    const instagramLink = document.getElementById('instagram-link');
    if (!instagramLink) return;

    instagramLink.addEventListener('click', event => {
      event.preventDefault();
      instagramLink.classList.add('rotate');
      const url = instagramLink.getAttribute('href');
      setTimeout(() => {
        window.open(url, '_blank');
        instagramLink.classList.remove('rotate');
      }, 500);
    });
  }

  function initCookiesBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (!cookieBanner) return;

    if (!getCookie('cookiesAccepted')) {
      cookieBanner.style.display = 'block';
    }

    if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
        setCookie('cookiesAccepted', 'true', 365);
        cookieBanner.style.display = 'none';
      });
    }
  }

  function initSubscriptionForm() {
    const subscriptionForm = document.getElementById('subscription-form');
    const thankYouMessage = document.getElementById('thank-you-message');
    if (!subscriptionForm) return;

    subscriptionForm.addEventListener('submit', event => {
      event.preventDefault();

      const emailField = subscriptionForm.querySelector('input[type="email"]');
      const formData = new FormData(subscriptionForm);

      fetch(subscriptionForm.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(() => {
          if (emailField) emailField.value = '';
          subscriptionForm.style.display = 'none';
          if (thankYouMessage) thankYouMessage.style.display = 'block';

          setTimeout(() => {
            subscriptionForm.style.display = 'block';
            if (thankYouMessage) thankYouMessage.style.display = 'none';
          }, 3000);
        })
        .catch(() => {});
    });
  }

  const DEFAULT_IMAGES = [
    {
      src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Abstract art'
    },
    {
      src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Modern sculpture'
    },
    {
      src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Digital artwork'
    },
    {
      src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Contemporary art'
    },
    {
      src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Geometric pattern'
    },
    {
      src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'Textured surface'
    },
    { src: 'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large', alt: 'Social media image' }
  ];

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const wrapAngleSigned = deg => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
  };

  function buildItems(pool, segments) {
    const xCols = Array.from({ length: segments }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (!pool || pool.length === 0) {
      return coords.map(c => ({ ...c, src: '', alt: '' }));
    }

    const normalized = pool.map(image => {
      if (typeof image === 'string') return { src: image, alt: '' };
      return { src: image?.src || '', alt: image?.alt || '' };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalized[i % normalized.length]);
    for (let i = 1; i < usedImages.length; i++) {
      if (usedImages[i].src === usedImages[i - 1].src) {
        for (let j = i + 1; j < usedImages.length; j++) {
          if (usedImages[j].src !== usedImages[i].src) {
            const tmp = usedImages[i];
            usedImages[i] = usedImages[j];
            usedImages[j] = tmp;
            break;
          }
        }
      }
    }

    return coords.map((c, i) => ({
      ...c,
      src: usedImages[i].src,
      alt: usedImages[i].alt
    }));
  }

  function initDomeGallery(container, opts) {
    const options = opts || {};
    const images = options.images || DEFAULT_IMAGES;
    const fit = typeof options.fit === 'number' ? options.fit : 0.5;
    const fitBasis = options.fitBasis || 'auto';
    const minRadius = typeof options.minRadius === 'number' ? options.minRadius : 600;
    const maxRadius = typeof options.maxRadius === 'number' ? options.maxRadius : Infinity;
    const padFactor = typeof options.padFactor === 'number' ? options.padFactor : 0.25;
    const overlayBlurColor = options.overlayBlurColor || '#060010';
    const maxVerticalRotationDeg = typeof options.maxVerticalRotationDeg === 'number' ? options.maxVerticalRotationDeg : 5;
    const dragSensitivity = typeof options.dragSensitivity === 'number' ? options.dragSensitivity : 20;
    const enlargeTransitionMs = typeof options.enlargeTransitionMs === 'number' ? options.enlargeTransitionMs : 300;
    const segments = typeof options.segments === 'number' ? options.segments : 35;
    const dragDampening = typeof options.dragDampening === 'number' ? options.dragDampening : 2;
    const openedImageWidth = options.openedImageWidth || '250px';
    const openedImageHeight = options.openedImageHeight || '350px';
    const imageBorderRadius = options.imageBorderRadius || '30px';
    const openedImageBorderRadius = options.openedImageBorderRadius || '30px';
    const grayscale = options.grayscale !== false;

    container.innerHTML = '';

    const root = document.createElement('div');
    root.className = 'sphere-root';
    root.style.setProperty('--segments-x', String(segments));
    root.style.setProperty('--segments-y', String(segments));
    root.style.setProperty('--overlay-blur-color', overlayBlurColor);
    root.style.setProperty('--tile-radius', imageBorderRadius);
    root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
    root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');

    const main = document.createElement('main');
    main.className = 'sphere-main';

    const stage = document.createElement('div');
    stage.className = 'stage';

    const sphere = document.createElement('div');
    sphere.className = 'sphere';

    const items = buildItems(images, segments);
    for (let i = 0; i < items.length; i++) {
      const it = items[i];

      const item = document.createElement('div');
      item.className = 'item';
      item.dataset.src = it.src;
      item.style.setProperty('--offset-x', String(it.x));
      item.style.setProperty('--offset-y', String(it.y));
      item.style.setProperty('--item-size-x', String(it.sizeX));
      item.style.setProperty('--item-size-y', String(it.sizeY));

      const tile = document.createElement('div');
      tile.className = 'item__image';
      tile.setAttribute('role', 'button');
      tile.tabIndex = 0;
      tile.setAttribute('aria-label', it.alt || 'Open image');

      const img = document.createElement('img');
      img.src = it.src;
      img.alt = it.alt || '';
      img.draggable = false;

      tile.appendChild(img);
      item.appendChild(tile);
      sphere.appendChild(item);
    }

    stage.appendChild(sphere);
    main.appendChild(stage);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    main.appendChild(overlay);

    const overlayBlur = document.createElement('div');
    overlayBlur.className = 'overlay overlay--blur';
    main.appendChild(overlayBlur);

    const edgeTop = document.createElement('div');
    edgeTop.className = 'edge-fade edge-fade--top';
    main.appendChild(edgeTop);

    const edgeBottom = document.createElement('div');
    edgeBottom.className = 'edge-fade edge-fade--bottom';
    main.appendChild(edgeBottom);

    const viewer = document.createElement('div');
    viewer.className = 'viewer';

    const scrim = document.createElement('div');
    scrim.className = 'scrim';

    const frame = document.createElement('div');
    frame.className = 'frame';
    frame.style.width = openedImageWidth;
    frame.style.height = openedImageHeight;

    viewer.appendChild(scrim);
    viewer.appendChild(frame);
    main.appendChild(viewer);

    root.appendChild(main);
    container.appendChild(root);

    const rotation = { x: 0, y: 0 };
    const startRot = { x: 0, y: 0 };
    const startPos = { x: 0, y: 0 };
    let dragging = false;
    let moved = false;
    let lastDragEndAt = 0;
    let lastMove = null;
    let inertiaRaf = null;
    let velocity = { x: 0, y: 0 };

    let focusedTile = null;
    let enlargeEl = null;

    function applyTransform() {
      sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }

    function stopInertia() {
      if (inertiaRaf) {
        cancelAnimationFrame(inertiaRaf);
        inertiaRaf = null;
      }
    }

    function startInertia(vxPxPerMs, vyPxPerMs) {
      stopInertia();

      const MAX_V = 1.4;
      let vX = clamp(vxPxPerMs, -MAX_V, MAX_V) * 80;
      let vY = clamp(vyPxPerMs, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening, 0, 2);
      const frictionMul = 0.94 + 0.02 * d;
      const stopThreshold = 0.015 - 0.004 * d;
      const maxFrames = Math.round(120 + 120 * d);

      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRaf = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRaf = null;
          return;
        }

        rotation.x = clamp(rotation.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        rotation.y = wrapAngleSigned(rotation.y + vX / 200);
        applyTransform();
        inertiaRaf = requestAnimationFrame(step);
      };

      inertiaRaf = requestAnimationFrame(step);
    }

    function lockScroll() {
      document.body.classList.add('dg-scroll-lock');
    }

    function unlockScroll() {
      if (root.getAttribute('data-enlarging') === 'true') return;
      document.body.classList.remove('dg-scroll-lock');
    }

    function closeEnlarge() {
      if (!enlargeEl || !focusedTile) {
        root.removeAttribute('data-enlarging');
        unlockScroll();
        return;
      }

      const mainR = main.getBoundingClientRect();
      const frameR = frame.getBoundingClientRect();
      const tileR = focusedTile.getBoundingClientRect();

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      enlargeEl.style.opacity = '0';
      enlargeEl.style.transform = `translate(${tx0}px, ${ty0}px) scale(${isFinite(sx0) && sx0 > 0 ? sx0 : 1}, ${isFinite(sy0) && sy0 > 0 ? sy0 : 1})`;

      const onEnd = () => {
        enlargeEl && enlargeEl.removeEventListener('transitionend', onEnd);
        if (enlargeEl) enlargeEl.remove();
        enlargeEl = null;
        if (focusedTile) focusedTile.style.visibility = '';
        focusedTile = null;
        root.removeAttribute('data-enlarging');
        unlockScroll();
      };

      enlargeEl.addEventListener('transitionend', onEnd);
      void mainR;
    }

    function openFromTile(tile) {
      if (dragging) return;
      if (moved) return;
      if (performance.now() - lastDragEndAt < 80) return;
      if (root.getAttribute('data-enlarging') === 'true') return;

      lockScroll();
      focusedTile = tile;

      const mainR = main.getBoundingClientRect();
      const frameR = frame.getBoundingClientRect();
      const tileR = tile.getBoundingClientRect();

      const overlayEl = document.createElement('div');
      overlayEl.className = 'enlarge';
      overlayEl.style.left = frameR.left - mainR.left + 'px';
      overlayEl.style.top = frameR.top - mainR.top + 'px';
      overlayEl.style.width = frameR.width + 'px';
      overlayEl.style.height = frameR.height + 'px';
      overlayEl.style.opacity = '0';
      overlayEl.style.willChange = 'transform, opacity';
      overlayEl.style.transformOrigin = 'top left';
      overlayEl.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;

      const rawSrc = tile.parentElement && tile.parentElement.dataset ? tile.parentElement.dataset.src : '';
      const img = document.createElement('img');
      img.src = rawSrc || tile.querySelector('img')?.src || '';
      overlayEl.appendChild(img);

      viewer.appendChild(overlayEl);
      enlargeEl = overlayEl;

      tile.style.visibility = 'hidden';

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      overlayEl.style.transform = `translate(${tx0}px, ${ty0}px) scale(${isFinite(sx0) && sx0 > 0 ? sx0 : 1}, ${isFinite(sy0) && sy0 > 0 ? sy0 : 1})`;

      setTimeout(() => {
        if (!overlayEl.parentElement) return;
        overlayEl.style.opacity = '1';
        overlayEl.style.transform = 'translate(0px, 0px) scale(1, 1)';
        root.setAttribute('data-enlarging', 'true');
      }, 16);
    }

    function onPointerDown(e) {
      if (root.getAttribute('data-enlarging') === 'true') return;
      if (e.button != null && e.button !== 0) return;
      dragging = true;
      moved = false;
      stopInertia();
      startPos.x = e.clientX;
      startPos.y = e.clientY;
      startRot.x = rotation.x;
      startRot.y = rotation.y;
      lastMove = { t: performance.now(), x: e.clientX, y: e.clientY };
      velocity.x = 0;
      velocity.y = 0;
      if (main.setPointerCapture) main.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dxTotal = e.clientX - startPos.x;
      const dyTotal = e.clientY - startPos.y;
      if (!moved) {
        const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
        if (dist2 > 16) moved = true;
      }

      rotation.x = clamp(startRot.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      rotation.y = wrapAngleSigned(startRot.y + dxTotal / dragSensitivity);
      applyTransform();

      const now = performance.now();
      const dt = now - (lastMove ? lastMove.t : now);
      if (dt > 0) {
        velocity.x = (e.clientX - (lastMove ? lastMove.x : e.clientX)) / dt;
        velocity.y = (e.clientY - (lastMove ? lastMove.y : e.clientY)) / dt;
        lastMove = { t: now, x: e.clientX, y: e.clientY };
      }
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      lastDragEndAt = performance.now();
      if (main.releasePointerCapture) main.releasePointerCapture(e.pointerId);
      if (Math.abs(velocity.x) > 0.005 || Math.abs(velocity.y) > 0.005) startInertia(velocity.x, velocity.y);
    }

    main.addEventListener('pointerdown', onPointerDown);
    main.addEventListener('pointermove', onPointerMove);
    main.addEventListener('pointerup', onPointerUp);
    main.addEventListener('pointercancel', onPointerUp);

    sphere.querySelectorAll('.item__image').forEach(tile => {
      tile.addEventListener('click', e => openFromTile(e.currentTarget));
      tile.addEventListener('pointerup', e => {
        if (e.pointerType !== 'touch') return;
        openFromTile(e.currentTarget);
      });
    });

    scrim.addEventListener('click', closeEnlarge);
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeEnlarge();
    });

    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;

      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }

      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      const viewerPad = Math.max(8, Math.round(minDim * padFactor));

      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform();
    });

    ro.observe(root);
    applyTransform();

    return () => {
      stopInertia();
      ro.disconnect();
      main.removeEventListener('pointerdown', onPointerDown);
      main.removeEventListener('pointermove', onPointerMove);
      main.removeEventListener('pointerup', onPointerUp);
      main.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', closeEnlarge);
      root.remove();
      unlockScroll();
    };
  }

  function boot() {
    initInstagram();
    initCookiesBanner();
    initSubscriptionForm();

    const galleryRoot = document.getElementById('dome-gallery-root');
    if (galleryRoot) {
      initDomeGallery(galleryRoot, { maxVerticalRotationDeg: 9, grayscale: false });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

