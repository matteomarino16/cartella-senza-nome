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
    'foto/588665308_17909099940276766_928416036352322985_n.jpeg',
    'foto/SnapInsta.to_450149310_1005556387466881_5208494146935274280_n.jpg',
    'foto/SnapInsta.to_462513356_570566022068141_4723863725904009314_n.jpg',
    'foto/SnapInsta.to_501522370_17887105701276766_2531496049446557552_n.jpg',
    'foto/SnapInsta.to_501597704_17887105692276766_6131001459093330877_n.jpg',
    'foto/SnapInsta.to_526445936_18513872728046382_2030986599807307265_n.jpg',
    'foto/SnapInsta.to_526590357_18513872704046382_6368367978550388487_n.jpg',
    'foto/SnapInsta.to_526616336_18513872632046382_449656303098729916_n.jpg',
    'foto/SnapInsta.to_526749647_18513872599046382_2416359525427572614_n.jpg',
    'foto/SnapInsta.to_527148157_18513872746046382_7744660904736767951_n.jpg',
    'foto/SnapInsta.to_527161912_18513872665046382_1860942728023364546_n.jpg',
    'foto/SnapInsta.to_527391941_18513872650046382_2408536109517205974_n.jpg',
    'foto/SnapInsta.to_527488141_18513872719046382_5856824282604510465_n.jpg',
    'foto/SnapInsta.to_528032747_18513872680046382_974627040226300982_n.jpg',
    'foto/SnapInsta.to_534317631_17897115468276766_5448618772879368822_n.jpg',
    'foto/SnapInsta.to_535052058_17897115459276766_4406223951782689557_n.jpg',
    'foto/SnapInsta.to_535056482_17897115450276766_5949168411527386542_n.jpg',
    'foto/SnapInsta.to_536663510_17897115441276766_4959488097667154373_n.jpg',
    'foto/SnapInsta.to_550785907_17900880135276766_982647241851230940_n.jpg',
    'foto/SnapInsta.to_550860763_17900880162276766_5747060900231008260_n.jpg',
    'foto/SnapInsta.to_584037041_17907455589276766_5157358910638608213_n.jpg',
    'foto/SnapInsta.to_586663076_17907455553276766_8747698618963906629_n.jpg',
    'foto/SnapInsta.to_586683907_18541367335046382_2886026434628958112_n.jpg',
    'foto/SnapInsta.to_586720708_18541367566046382_3335996435246954050_n.jpg',
    'foto/SnapInsta.to_586873139_17907455562276766_8938545650830162956_n.jpg',
    'foto/SnapInsta.to_587431965_18541367332046382_2714695777272285518_n.jpg',
    'foto/SnapInsta.to_587750901_18541367464046382_2201705062819921296_n.jpg',
    'foto/SnapInsta.to_587755260_18541367476046382_6897834849515114349_n.jpg',
    'foto/SnapInsta.to_590812123_18541367533046382_1416851289453352256_n.jpg',
    'foto/SnapInsta.to_590888426_18541367506046382_419355760353245822_n.jpg',
    'foto/SnapInsta.to_599840274_18541367359046382_1467601753999161706_n.jpg',
    'foto/SnapInsta.to_602344942_18541367542046382_5569509533674785590_n.jpg'
  ];

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const wrapAngleSigned = deg => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
  };

  function buildItemsClassic(pool, segmentsX) {
    const xHalf = Math.floor(segmentsX / 2);
    const xCols = Array.from({ length: segmentsX }, (_, i) => (i - xHalf) * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    return fillCoordsWithImages(coords, pool);
  }

  function buildItemsVertical(pool, segmentsX, segmentsY) {
    const xHalf = Math.floor(segmentsX / 2);
    const yHalf = Math.floor(segmentsY / 2);
    const xCols = Array.from({ length: segmentsX }, (_, i) => (i - xHalf) * 2);
    const baseYs = Array.from({ length: segmentsY }, (_, i) => (i - yHalf) * 2);

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? baseYs : baseYs.map(v => v + 1);
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    return fillCoordsWithImages(coords, pool);
  }

  function buildItemsStack(pool) {
    if (!pool || pool.length === 0) return [];
    const normalized = pool.map(image => {
      if (typeof image === 'string') return { src: image, alt: '' };
      return { src: image?.src || '', alt: image?.alt || '' };
    });
    return normalized
      .filter(img => !!img.src)
      .map((img, i) => ({ x: 0, y: i, sizeX: 1, sizeY: 1, src: img.src, alt: img.alt }));
  }

  function fillCoordsWithImages(coords, pool) {
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
    const layout = options.layout || 'classic';
    const lockHorizontalRotation = options.lockHorizontalRotation === true;
    const rotateMobile = options.rotateMobile === true;
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
    const segmentsX = typeof options.segmentsX === 'number' ? options.segmentsX : segments;
    const segmentsY = typeof options.segmentsY === 'number' ? options.segmentsY : segments;
    const dragDampening = typeof options.dragDampening === 'number' ? options.dragDampening : 2;
    const openedImageWidth = options.openedImageWidth || '250px';
    const openedImageHeight = options.openedImageHeight || '350px';
    const imageBorderRadius = options.imageBorderRadius || '30px';
    const openedImageBorderRadius = options.openedImageBorderRadius || '30px';
    const grayscale = options.grayscale !== false;

    const galleryImages = (Array.isArray(images) ? images : [])
      .map(img => (typeof img === 'string' ? img : img?.src))
      .filter(Boolean);

    container.innerHTML = '';

    const root = document.createElement('div');
    root.className = 'sphere-root';
    root.setAttribute('data-layout', layout);
    if (rotateMobile) root.setAttribute('data-rotate-mobile', 'true');
    root.style.setProperty('--segments-x', String(segmentsX));
    root.style.setProperty('--segments-y', String(segmentsY));
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

    const items =
      layout === 'stack'
        ? buildItemsStack(images)
        : layout === 'vertical'
          ? buildItemsVertical(images, segmentsX, segmentsY)
          : buildItemsClassic(images, segmentsX);
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

    const sphereWrap = document.createElement('div');
    sphereWrap.className = 'sphere-wrap';
    sphereWrap.appendChild(sphere);
    stage.appendChild(sphereWrap);
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

    viewer.appendChild(scrim);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'dg-close';
    closeBtn.textContent = '×';
    viewer.appendChild(closeBtn);

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'dg-nav dg-nav--prev';
    prevBtn.textContent = '‹';
    viewer.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'dg-nav dg-nav--next';
    nextBtn.textContent = '›';
    viewer.appendChild(nextBtn);

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
    let pointerDownTile = null;
    const TAP_SLOP_PX = 10;
    const TAP_SLOP2 = TAP_SLOP_PX * TAP_SLOP_PX;

    let focusedTile = null;
    let enlargeEl = null;
    let currentIndex = 0;

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
      if (enlargeEl) {
        enlargeEl.remove();
        enlargeEl = null;
      }
      if (focusedTile) {
        focusedTile.style.visibility = '';
        focusedTile = null;
      }
      root.removeAttribute('data-enlarging');
      unlockScroll();
    }

    function showIndex(nextIndex) {
      if (galleryImages.length === 0) return;
      const len = galleryImages.length;
      currentIndex = ((nextIndex % len) + len) % len;
      if (!enlargeEl) return;
      const img = enlargeEl.querySelector('img');
      if (img) img.src = galleryImages[currentIndex];
    }

    function openFromTile(tile, ignoreRecentDrag) {
      if (dragging) return;
      if (!ignoreRecentDrag && performance.now() - lastDragEndAt < 120) return;
      if (root.getAttribute('data-enlarging') === 'true') return;

      lockScroll();
      focusedTile = tile;

      const rawSrc = tile.parentElement && tile.parentElement.dataset ? tile.parentElement.dataset.src : '';
      const tileSrc = rawSrc || tile.querySelector('img')?.src || '';
      const idx = galleryImages.indexOf(tileSrc);
      currentIndex = idx >= 0 ? idx : 0;

      const overlayEl = document.createElement('div');
      overlayEl.className = 'dg-lightbox';

      const img = document.createElement('img');
      img.src = galleryImages[currentIndex] || tileSrc;
      overlayEl.appendChild(img);

      let swipeStart = null;
      overlayEl.addEventListener('pointerdown', e => {
        swipeStart = { x: e.clientX, y: e.clientY };
        if (overlayEl.setPointerCapture) overlayEl.setPointerCapture(e.pointerId);
      });
      overlayEl.addEventListener('pointerup', e => {
        if (!swipeStart) return;
        const dx = e.clientX - swipeStart.x;
        const dy = e.clientY - swipeStart.y;
        swipeStart = null;
        if (overlayEl.releasePointerCapture) overlayEl.releasePointerCapture(e.pointerId);

        if (Math.abs(dx) < 50) return;
        if (Math.abs(dx) < Math.abs(dy) * 1.2) return;
        if (dx < 0) showIndex(currentIndex + 1);
        else showIndex(currentIndex - 1);
      });
      overlayEl.addEventListener('pointercancel', e => {
        swipeStart = null;
        if (overlayEl.releasePointerCapture) overlayEl.releasePointerCapture(e.pointerId);
      });

      viewer.appendChild(overlayEl);
      enlargeEl = overlayEl;
      tile.style.visibility = 'hidden';
      root.setAttribute('data-enlarging', 'true');
    }

    function onPointerDown(e) {
      if (root.getAttribute('data-enlarging') === 'true') return;
      if (e.button != null && e.button !== 0) return;
      dragging = true;
      moved = false;
      stopInertia();
      pointerDownTile = e.target && e.target.closest ? e.target.closest('.item__image') : null;
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
      const rawDxTotal = e.clientX - startPos.x;
      const rawDyTotal = e.clientY - startPos.y;
      const dxTotal = rotateMobile ? -rawDyTotal : rawDxTotal;
      const dyTotal = rotateMobile ? rawDxTotal : rawDyTotal;
      if (!moved) {
        const dist2 = rawDxTotal * rawDxTotal + rawDyTotal * rawDyTotal;
        if (dist2 <= TAP_SLOP2) return;
        moved = true;
      }

      rotation.x = clamp(startRot.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      rotation.y = lockHorizontalRotation ? startRot.y : wrapAngleSigned(startRot.y + dxTotal / dragSensitivity);
      applyTransform();

      const now = performance.now();
      const dt = now - (lastMove ? lastMove.t : now);
      if (dt > 0) {
        const rawVx = (e.clientX - (lastMove ? lastMove.x : e.clientX)) / dt;
        const rawVy = (e.clientY - (lastMove ? lastMove.y : e.clientY)) / dt;
        velocity.x = rotateMobile ? -rawVy : rawVx;
        velocity.y = rotateMobile ? rawVx : rawVy;
        lastMove = { t: now, x: e.clientX, y: e.clientY };
      }
    }

    function onPointerUp(e) {
      if (!dragging) return;
      const tileToOpen = pointerDownTile;
      const wasMoved = moved;
      dragging = false;
      if (wasMoved) lastDragEndAt = performance.now();
      moved = false;
      pointerDownTile = null;
      if (main.releasePointerCapture) main.releasePointerCapture(e.pointerId);
      if (wasMoved && (Math.abs(velocity.x) > 0.005 || Math.abs(velocity.y) > 0.005)) startInertia(velocity.x, velocity.y);
      if (!wasMoved && tileToOpen) openFromTile(tileToOpen, true);
    }

    function onPointerCancel(e) {
      if (!dragging) return;
      dragging = false;
      moved = false;
      pointerDownTile = null;
      if (main.releasePointerCapture) main.releasePointerCapture(e.pointerId);
    }

    const enableDrag = layout !== 'stack';
    if (enableDrag) {
      main.addEventListener('pointerdown', onPointerDown);
      main.addEventListener('pointermove', onPointerMove);
      main.addEventListener('pointerup', onPointerUp);
      main.addEventListener('pointercancel', onPointerCancel);
    }

    sphere.querySelectorAll('.item__image').forEach(tile => {
      if (!enableDrag) {
        tile.addEventListener('click', () => openFromTile(tile, true));
        tile.addEventListener('pointerup', () => openFromTile(tile, true));
      }
      tile.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        openFromTile(tile, true);
      });
    });

    scrim.addEventListener('click', closeEnlarge);
    closeBtn.addEventListener('click', closeEnlarge);
    prevBtn.addEventListener('click', () => showIndex(currentIndex - 1));
    nextBtn.addEventListener('click', () => showIndex(currentIndex + 1));
    const onKeyDown = e => {
      if (e.key === 'Escape') closeEnlarge();
      if (root.getAttribute('data-enlarging') !== 'true') return;
      if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
      if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
    };
    window.addEventListener('keydown', onKeyDown);

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
      if (enableDrag) {
        main.removeEventListener('pointerdown', onPointerDown);
        main.removeEventListener('pointermove', onPointerMove);
        main.removeEventListener('pointerup', onPointerUp);
        main.removeEventListener('pointercancel', onPointerCancel);
      }
      window.removeEventListener('keydown', onKeyDown);
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
      const isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
      initDomeGallery(
        galleryRoot,
        isMobile
          ? {
              minRadius: 320,
              maxRadius: 820,
              fit: 0.68,
              fitBasis: 'min',
              padFactor: 0.16,
              maxVerticalRotationDeg: 9,
              rotateMobile: true,
              imageBorderRadius: '0px',
              grayscale: false
            }
          : { maxVerticalRotationDeg: 9, imageBorderRadius: '0px', grayscale: false }
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
