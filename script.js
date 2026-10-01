const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

const observerOptions = {
  threshold: 0.2
};


/* =========================
   TYPEWRITER
========================= */

function handleTypewriter() {

  const element = document.querySelector('.typewriter');

  if (!element) return;

  const text = 'Python Developer';

  let index = 0;
  let deleting = false;

  setInterval(() => {

    if (!deleting) {

      element.textContent =
        text.slice(0, index) + '|';

      index++;

      if (index > text.length) {
        deleting = true;
      }

    } else {

      element.textContent =
        text.slice(0, index) + '|';

      index--;

      if (index < 0) {

        index = 0;
        deleting = false;

      }

    }

  }, 120);
}


/* =========================
   ACTIVE NAVIGATION
========================= */

function setActiveLink() {

  const scrollPos =
    window.scrollY + window.innerHeight / 3;

  sections.forEach((section) => {

    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    const link = document.querySelector(
      `.nav-link[href="#${id}"]`
    );

    if (
      scrollPos >= top &&
      scrollPos < top + height
    ) {

      navLinks.forEach((item) => {
        item.classList.remove('active');
      });

      if (link) {
        link.classList.add('active');
      }

    }

  });

}


/* =========================
   SCROLL ANIMATION
========================= */

function createObserver() {

  const blocks =
    document.querySelectorAll('.fade-up');

  if (!blocks.length) return;

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add('visible');

            observer.unobserve(entry.target);

          }

        });

      },
      observerOptions
    );

  blocks.forEach((block) => {
    observer.observe(block);
  });

}


/* =========================
   CERTIFICATE MODAL
========================= */

function initModal() {

  const modal =
    document.getElementById('image-modal');

  if (!modal) return;

  const modalImage =
    modal.querySelector('img');

  const closeButton =
    modal.querySelector('.modal-close');

  if (!modalImage || !closeButton) return;


  /* =========================
     OPEN CERTIFICATE
  ========================= */

  document
    .querySelectorAll('.certificate-card')
    .forEach((certificate) => {

      certificate.addEventListener(
        'click',
        () => {

          const imageUrl =
            certificate.getAttribute('data-image');

          if (!imageUrl) return;

          modalImage.src = imageUrl;

          modal.classList.add('active');

          modal.setAttribute(
            'aria-hidden',
            'false'
          );

          document.body.style.overflow = 'hidden';

        }
      );

    });


  /* =========================
     CLOSE BUTTON
  ========================= */

  closeButton.addEventListener(
    'click',
    closeCertificate
  );


  /* =========================
     CLICK OUTSIDE
  ========================= */

  modal.addEventListener(
    'click',
    (event) => {

      if (event.target === modal) {
        closeCertificate();
      }

    }
  );


  /* =========================
     ESC KEY
  ========================= */

  document.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key === 'Escape' &&
        modal.classList.contains('active')
      ) {

        closeCertificate();

      }

    }
  );


  /* =========================
     CLOSE FUNCTION
  ========================= */

  function closeCertificate() {

    modal.classList.remove('active');

    modal.setAttribute(
      'aria-hidden',
      'true'
    );

    modalImage.src = '';

    document.body.style.overflow = '';

  }

}


/* =========================
   CONTACT FORM
   FLASK + MYSQL
========================= */

function initForm() {

  const form =
    document.getElementById('contact-form');

  if (!form) {
    return;
  }


  const feedback =
    form.querySelector('.form-feedback');

  const button =
    form.querySelector(
      'button[type="submit"]'
    );


  /* =========================
     FORM SUBMIT
  ========================= */

  form.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();


      /* =========================
         GET FORM VALUES
      ========================= */

      const nameInput =
        form.querySelector(
          '[name="name"]'
        );

      const emailInput =
        form.querySelector(
          '[name="email"]'
        );

      const messageInput =
        form.querySelector(
          '[name="message"]'
        );


      const name =
        nameInput
          ? nameInput.value.trim()
          : '';

      const email =
        emailInput
          ? emailInput.value.trim()
          : '';

      const message =
        messageInput
          ? messageInput.value.trim()
          : '';


      /* =========================
         VALIDATION
      ========================= */

      if (!name || !email || !message) {

        if (feedback) {

          feedback.textContent =
            'Please fill all fields.';

        }

        return;

      }


      /* =========================
         BUTTON LOADING
      ========================= */

      if (button) {

        button.disabled = true;

        button.textContent =
          'Sending...';

      }


      if (feedback) {

        feedback.textContent =
          'Sending your message...';

      }


      /* =========================
         SEND DATA TO FLASK
         
         IMPORTANT:
         Flask route = /contact
      ========================= */

      try {

        const response =
          await fetch(
            '/contact',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                'Accept':
                  'application/json'
              },

              body: JSON.stringify({
                name: name,
                email: email,
                message: message
              })
            }
          );


        /* =========================
           READ SERVER RESPONSE
        ========================= */

        let result = {};

        try {

          result =
            await response.json();

        } catch (error) {

          result = {};

        }


        /* =========================
           SUCCESS
        ========================= */

        if (
          response.ok &&
          result.success
        ) {

          if (feedback) {

            feedback.textContent =
              'Message sent successfully! ✅';

          }

          form.reset();

        }


        /* =========================
           SERVER ERROR
        ========================= */

        else {

          if (feedback) {

            feedback.textContent =
              result.message ||
              'Something went wrong. Please try again.';

          }

        }


      } catch (error) {

        console.error(
          'Contact form error:',
          error
        );


        if (feedback) {

          feedback.textContent =
            'Server connection failed. Please try again.';

        }

      }


      /* =========================
         ENABLE BUTTON
      ========================= */

      if (button) {

        button.disabled = false;

        button.textContent =
          'Send Message';

      }

    }
  );

}


/* =========================
   MOBILE MENU
========================= */

function initMenu() {

  if (!navToggle || !navList) {
    return;
  }


  navToggle.addEventListener(
    'click',
    () => {

      const expanded =
        navToggle.getAttribute(
          'aria-expanded'
        ) === 'true';


      navToggle.setAttribute(
        'aria-expanded',
        String(!expanded)
      );


      navList.classList.toggle(
        'open'
      );

    }
  );


  navLinks.forEach((link) => {

    link.addEventListener(
      'click',
      () => {

        navList.classList.remove(
          'open'
        );

        navToggle.setAttribute(
          'aria-expanded',
          'false'
        );

      }
    );

  });

}


/* =========================
   SCROLL EVENT
========================= */

window.addEventListener(
  'scroll',
  setActiveLink
);


/* =========================
   PAGE LOAD
========================= */

window.addEventListener(
  'DOMContentLoaded',
  () => {

    handleTypewriter();

    createObserver();

    initModal();

    initForm();

    initMenu();

    setActiveLink();

  }
);