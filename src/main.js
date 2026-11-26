import './style.css'

const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.site-nav')
const progressBar = document.querySelector('.page-progress span')
const visualFrame = document.querySelector('.visual-frame')

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true'
  menuButton.setAttribute('aria-expanded', String(!isOpen))
  navigation.classList.toggle('is-open', !isOpen)
})

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false')
    navigation.classList.remove('is-open')
  })
})

const updateProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
  progressBar.style.transform = `scaleX(${progress})`
}

window.addEventListener('scroll', updateProgress, { passive: true })
updateProgress()

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (reducedMotion) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.14 },
  )

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
}

if (window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  visualFrame.addEventListener('pointermove', (event) => {
    const bounds = visualFrame.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    visualFrame.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`
  })

  visualFrame.addEventListener('pointerleave', () => {
    visualFrame.style.transform = ''
  })
}
