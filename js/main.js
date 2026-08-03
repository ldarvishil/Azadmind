document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuIconOpen = document.getElementById('menu-icon-open');
  const mobileMenuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        if (mobileMenuIconOpen) mobileMenuIconOpen.classList.add('hidden');
        if (mobileMenuIconClose) mobileMenuIconClose.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        if (mobileMenuIconOpen) mobileMenuIconOpen.classList.remove('hidden');
        if (mobileMenuIconClose) mobileMenuIconClose.classList.add('hidden');
      }
    });
  }

  // 2. Course Registration Modal Controls
  const openModalBtns = document.querySelectorAll('.js-open-reg-modal');
  const closeModalBtns = document.querySelectorAll('.js-close-reg-modal');
  const modalOverlay = document.getElementById('registration-modal');
  const regForm = document.getElementById('modal-reg-form');
  const regSuccess = document.getElementById('modal-reg-success');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = regForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>در حال ارسال...</span>`;
      }
      setTimeout(() => {
        regForm.classList.add('hidden');
        if (regSuccess) regSuccess.classList.remove('hidden');
      }, 600);
    });
  }

  // 3. Chapter Accordion Toggles
  const chapterHeaders = document.querySelectorAll('.js-chapter-toggle');
  chapterHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('.js-accordion-arrow');
      if (content) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
          content.classList.add('hidden');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // 4. FAQ Accordion Toggles
  const faqHeaders = document.querySelectorAll('.js-faq-toggle');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('.js-faq-arrow');
      if (content) {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
          content.classList.add('hidden');
          if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
      }
    });
  });

  // 5. Contact Form Handler
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success-msg');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>در حال ارسال...</span>`;
      }
      setTimeout(() => {
        contactForm.classList.add('hidden');
        if (contactSuccess) contactSuccess.classList.remove('hidden');
      }, 600);
    });
  }

  // 6. Blog Filter & Search Handler
  const blogSearchInput = document.getElementById('blog-search') || document.getElementById('blog-search-input');
  const filterBtns = document.querySelectorAll('.js-filter-btn, .js-category-btn');
  const articleCards = document.querySelectorAll('.article-card, .js-blog-card');

  let activeCategory = 'all';

  function filterBlogPosts() {
    const query = (blogSearchInput ? blogSearchInput.value : '').trim().toLowerCase();
    articleCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const textContent = card.textContent.toLowerCase();

      const matchesCat = activeCategory === 'all' || cardCat === activeCategory;
      const matchesSearch = !query || textContent.includes(query);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'font-bold', 'bg-slate-900');
        b.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700');
      });
      btn.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700');
      btn.classList.add('bg-indigo-600', 'text-white', 'font-bold');
      activeCategory = btn.getAttribute('data-category') || 'all';
      filterBlogPosts();
    });
  });

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', filterBlogPosts);
    const searchUrlParam = new URLSearchParams(window.location.search).get('q');
    if (searchUrlParam) {
      blogSearchInput.value = searchUrlParam;
      filterBlogPosts();
    }
  }

  // 7. Dynamic Article Renderer based on ?id= query param
  const articlesData = {
    'how-to-read-1000-wpm': {
      title: 'چگونه به سرعت مطالعه ۱۰۰۰ کلمه در دقیقه برسیم؟ (راهنمای عملی)',
      category: 'تندخوانی',
      author: 'استاد حسن مرادی',
      authorRole: 'مدرس و پژوهشگر تندخوانی و تقویت حافظه',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      date: '۱۴۰۴/۰۵/۱۰',
      readTime: '۷ دقیقه',
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=1200',
      content: `
        <p class="text-slate-800 font-medium leading-relaxed bg-indigo-50/60 p-4 rounded-2xl border-r-4 border-indigo-600">
          تندخوانی یک استعداد مادرزادی یا جادویی نیست؛ بلکه مجموعه‌ای از تکنیک‌های فیزیولوژیک جهت همگام‌سازی سرعت حرکت چشم با قدرت پردازش بینایی مغز است. میانگین سرعت مطالعه افراد عادی حدود ۱۵۰ الی ۲۵۰ کلمه در دقیقه است، در حالی که با تمرینات منظم می‌توان این سرعت را به بالای ۱۰۰۰ کلمه ارتقا داد.
        </p>
        <h2 class="text-xl font-bold text-slate-900 pt-4">۱. حذف خطای بلندخوانی ذهنی (Sub-vocalization)</h2>
        <p>بزرگ‌ترین مانع در افزایش سرعت مطالعه، تلفظ کلمات در ذهن هنگام خواندن است. هنگامی که کلمات را درون ذهن خود تکرار می‌کنید، سرعت مطالعه شما به سقف سرعت صحبت کردن محدود خواهد شد.</p>
        <h2 class="text-xl font-bold text-slate-900 pt-4">۲. استفاده از چوب‌بردن یا خط‌بردن (Pacing)</h2>
        <p>چشم انسان به طور طبیعی هنگام خواندن حرکت‌های نامنظم دارد. استفاده از یک مداد یا انگشت اشاره، به چشم فرمان می‌دهد که با سرعتی ثابت به سمت جلو حرکت کند.</p>
        <h2 class="text-xl font-bold text-slate-900 pt-4">۳. گسترش میدان دید محیطی (Peripheral Vision)</h2>
        <p>به جای خواندن کلمه به کلمه، آموختن تکنیک عبارت‌خوانی به شما اجازه می‌دهد در هر توقف چشم، ۳ الی ۴ کلمه را هم‌زمان دریافت کنید.</p>
      `
    },
    'ebbinghaus-forgetting-curve': {
      title: 'منحنی فراموشی ابینگهاوس: چرا مطالب را فراموش می‌کنیم و چگونه جلوی آن را بگیریم؟',
      category: 'تقویت حافظه',
      author: 'فاطمه آزادخواه',
      authorRole: 'بنیان‌گذار ذهن آزاد و پژوهشگر روش‌های یادگیری',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      date: '۱۴۰۴/۰۵/۰۵',
      readTime: '۵ دقیقه',
      cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
      content: `
        <p class="text-slate-800 font-medium leading-relaxed bg-purple-50/60 p-4 rounded-2xl border-r-4 border-purple-600">
          بر اساس پژوهش‌های هرمان ابینگهاوس، انسان‌ها حدود ۷۰ درصد از اطلاعات جدید را در ۲۴ ساعت اول فراموش می‌کنند مگر آنکه زمان‌بندی مرور طلایی را رعایت نمایند.
        </p>
        <h2 class="text-xl font-bold text-slate-900 pt-4">اصول مرور فاصله‌دار (Spaced Repetition)</h2>
        <p>با مرور اطلاعات در فواصل ۲۰ دقیقه، ۲۴ ساعت، ۱ هفته و ۱ ماه بعد، مسیرهای عصبی ثبت اطلاعات تقویت شده و تثبیت ۱۰۰ درصدی در حافظه بلندمدت اتفاق می‌افتد.</p>
      `
    },
    'public-speaking-stage-fright': {
      title: 'غلبه بر ترس از سخنرانی: ۵ تکنیک کاربردی برای کنترل اضطراب قبل از رفتن روی سن',
      category: 'فن بیان',
      author: 'فاطمه آزادخواه',
      authorRole: 'بنیان‌گذار ذهن آزاد و پژوهشگر روش‌های یادگیری',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      date: '۱۴۰۴/۰۴/۲۸',
      readTime: '۶ دقیقه',
      cover: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
      content: `
        <p class="text-slate-800 font-medium leading-relaxed bg-emerald-50/60 p-4 rounded-2xl border-r-4 border-emerald-600">
          اضطراب سخنرانی (Glossophobia) یکی از شایع‌ترین ترس‌های روانی در دنیای امروز است. با به‌کارگیری تکنیک‌های تنفس عمیق و آماده‌سازی محتوا می‌توانید این ترس را کاملاً کنترل کنید.
        </p>
        <h2 class="text-xl font-bold text-slate-900 pt-4">۱. تکنیک تنفس ۴-۷-۸</h2>
        <p>تنفس دیافراگمی و کنترل ضربان قلب قبل از سخنرانی، سیستم عصب پاراسمپاتیک شما را فعال کرده و آرامش آنی ایجاد می‌کند.</p>
      `
    },
    'feynman-technique-explained': {
      title: 'تکنیک فاینمن: ساده‌ترین روش یادگیری سخت‌ترین فرمول‌ها و مفاهیم',
      category: 'روش‌های مطالعه',
      author: 'فاطمه آزادخواه',
      authorRole: 'بنیان‌گذار ذهن آزاد و پژوهشگر روش‌های یادگیری',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      date: '۱۴۰۴/۰۴/۲۰',
      readTime: '۸ دقیقه',
      cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
      content: `
        <p class="text-slate-800 font-medium leading-relaxed bg-amber-50/60 p-4 rounded-2xl border-r-4 border-amber-600">
          ریچارد فاینمن برنده جایزه نوبل فیزیک معتقد بود: «اگر نتوانید چیزی را به یک کودک ۱۲ ساله به زبان ساده توضیح دهید، خودتان آن را نفهمیده‌اید!»
        </p>
        <h2 class="text-xl font-bold text-slate-900 pt-4">۴ گام اصلی تکنیک فاینمن</h2>
        <p>۱. انتخاب موضوع <br>۲. آموزش مفاهیم به زبان کودکانه <br>۳. ریشه‌یابی نقاط مبهم و مراجعه مجدد به منبع <br>۴. ساده‌سازی و استفاده از تشبیهات داستانی</p>
      `
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (articleId && articlesData[articleId]) {
    const data = articlesData[articleId];
    const articleTitleEl = document.getElementById('article-title');
    const articleCatBreadcrumb = document.getElementById('article-category-breadcrumb');
    const articleBadge = document.getElementById('article-badge');
    const articleAuthorName = document.getElementById('article-author-name');
    const articleDate = document.getElementById('article-date');
    const articleReadTime = document.getElementById('article-read-time');
    const articleCoverImg = document.getElementById('article-cover-img');
    const articleContentEl = document.getElementById('article-content');
    const authorNameTitle = document.getElementById('author-name-title');
    const authorRole = document.getElementById('author-role');
    const authorAvatar = document.getElementById('author-avatar');

    if (articleTitleEl) articleTitleEl.textContent = data.title;
    if (articleCatBreadcrumb) articleCatBreadcrumb.textContent = data.category;
    if (articleBadge) articleBadge.textContent = `آموزش تخصصی ${data.category}`;
    if (articleAuthorName) articleAuthorName.textContent = `نویسنده: ${data.author}`;
    if (articleDate) articleDate.textContent = `تاریخ انتشار: ${data.date}`;
    if (articleReadTime) articleReadTime.textContent = `زمان مطالعه: ${data.readTime}`;
    if (articleCoverImg) {
      articleCoverImg.src = data.cover;
      articleCoverImg.alt = data.title;
    }
    if (articleContentEl) articleContentEl.innerHTML = data.content;
    if (authorNameTitle) authorNameTitle.textContent = data.author;
    if (authorRole) authorRole.textContent = data.authorRole;
    if (authorAvatar) authorAvatar.src = data.authorAvatar;
    document.title = `${data.title} | آکادمی ذهن آزاد`;
  }
});
