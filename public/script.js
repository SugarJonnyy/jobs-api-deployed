// ===== CONFIG =====
const BASE_URL = 'https://jobs-api-deployed-iu8z.onrender.com/api/v1'

// ===== STATE =====
let token = localStorage.getItem('jobsapi_token') || null
let userName = localStorage.getItem('jobsapi_user') || ''
let allJobs = []
let deleteTargetId = null

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard()
    fetchJobs()
  } else {
    showAuth()
  }
})

// ===== SCREEN MANAGEMENT =====
function showAuth() {
  document.getElementById('auth-screen').classList.add('active')
  document.getElementById('dashboard-screen').classList.remove('active')
}

function showDashboard() {
  document.getElementById('auth-screen').classList.remove('active')
  document.getElementById('dashboard-screen').classList.add('active')
  document.getElementById('user-greeting').textContent = `Hey, ${userName}`
}

// ===== TABS =====
function switchTab(tab) {
  const loginForm = document.getElementById('login-form')
  const registerForm = document.getElementById('register-form')
  const tabLogin = document.getElementById('tab-login')
  const tabReg = document.getElementById('tab-register')
  const indicator = document.getElementById('tab-indicator')

  clearErrors()

  if (tab === 'login') {
    loginForm.classList.remove('hidden')
    registerForm.classList.add('hidden')
    tabLogin.classList.add('active')
    tabReg.classList.remove('active')
    indicator.classList.remove('right')
  } else {
    loginForm.classList.add('hidden')
    registerForm.classList.remove('hidden')
    tabLogin.classList.remove('active')
    tabReg.classList.add('active')
    indicator.classList.add('right')
  }
}

// ===== AUTH =====
async function handleLogin(e) {
  e.preventDefault()
  const email    = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value

  setLoading('auth-submit-btn', true)
  clearErrors()

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.msg || 'Login failed')

    saveAuth(data.token, data.user.name)
    showDashboard()
    fetchJobs()
    showToast('Welcome back, ' + data.user.name, 'success')
  } catch (err) {
    showError('auth-error', err.message)
  } finally {
    setLoading('auth-submit-btn', false)
  }
}

async function handleRegister(e) {
  e.preventDefault()
  const name     = document.getElementById('reg-name').value.trim()
  const email    = document.getElementById('reg-email').value.trim()
  const password = document.getElementById('reg-password').value

  setLoading('auth-submit-btn-reg', true)
  clearErrors()

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.msg || 'Registration failed')

    saveAuth(data.token, data.user.name)
    showDashboard()
    fetchJobs()
    showToast('Account created! Welcome, ' + data.user.name, 'success')
  } catch (err) {
    showError('auth-error-reg', err.message)
  } finally {
    setLoading('auth-submit-btn-reg', false)
  }
}

function saveAuth(t, name) {
  token = t
  userName = name
  localStorage.setItem('jobsapi_token', t)
  localStorage.setItem('jobsapi_user', name)
}

function logout() {
  token = null
  userName = ''
  allJobs = []
  localStorage.removeItem('jobsapi_token')
  localStorage.removeItem('jobsapi_user')
  showAuth()
  switchTab('login')
}

// ===== JOBS API =====
async function fetchJobs() {
  try {
    const res = await fetch(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.status === 401) { logout(); return }

    const data = await res.json()
    allJobs = data.jobs || []
    renderJobs(allJobs)
    updateStats(allJobs)
  } catch (err) {
    showToast('Could not load jobs', 'error')
  }
}

async function handleJobSubmit(e) {
  e.preventDefault()

  const jobId    = document.getElementById('edit-job-id').value
  const position = document.getElementById('job-position').value.trim()
  const company  = document.getElementById('job-company').value.trim()
  const status   = document.getElementById('job-status').value
  const jobType  = document.getElementById('job-type').value

  const isEdit = !!jobId
  setLoading('job-submit-btn', true)
  clearErrors()

  try {
    const url    = isEdit ? `${BASE_URL}/jobs/${jobId}` : `${BASE_URL}/jobs`
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ position, company, status, jobType })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.msg || 'Something went wrong')

    showToast(isEdit ? 'Job updated!' : 'Job added!', 'success')
    resetJobForm()
    await fetchJobs()
    showPanel('all')
  } catch (err) {
    showError('job-form-error', err.message)
  } finally {
    setLoading('job-submit-btn', false)
  }
}

async function confirmDelete() {
  if (!deleteTargetId) return

  try {
    const res = await fetch(`${BASE_URL}/jobs/${deleteTargetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('Delete failed')

    showToast('Job deleted', 'success')
    closeDeleteModal()
    await fetchJobs()
  } catch (err) {
    showToast(err.message, 'error')
    closeDeleteModal()
  }
}

// ===== RENDER =====
function renderJobs(jobs) {
  const list = document.getElementById('jobs-list')
  const empty = document.getElementById('empty-state')

  // Clear existing cards (keep empty state)
  const cards = list.querySelectorAll('.job-card')
  cards.forEach(c => c.remove())

  if (!jobs.length) {
    empty.style.display = 'block'
    return
  }

  empty.style.display = 'none'

  jobs.forEach((job, i) => {
    const card = document.createElement('div')
    card.className = 'job-card'
    card.style.animationDelay = `${i * 40}ms`

    const date = new Date(job.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })

    card.innerHTML = `
      <div class="job-card-top">
        <div>
          <div class="job-position">${escHtml(job.position)}</div>
          <div class="job-company">${escHtml(job.company)}</div>
        </div>
        <span class="status-badge ${job.status}">${job.status}</span>
      </div>
      <div class="job-meta">
        <span>📅 ${date}</span>
        ${job.jobType ? `<span>· ${job.jobType}</span>` : ''}
      </div>
      <div class="job-card-actions">
        <button class="icon-btn edit" onclick="startEdit('${job._id}')">✏ Edit</button>
        <button class="icon-btn delete" onclick="openDeleteModal('${job._id}')">🗑 Delete</button>
      </div>
    `
    list.appendChild(card)
  })
}

function updateStats(jobs) {
  document.querySelector('#stat-total .stat-num').textContent = jobs.length
  document.getElementById('stat-pending').textContent   = jobs.filter(j => j.status === 'pending').length
  document.getElementById('stat-interview').textContent = jobs.filter(j => j.status === 'interview').length
  document.getElementById('stat-declined').textContent  = jobs.filter(j => j.status === 'declined').length
}

function filterJobs() {
  const search = document.getElementById('search-input').value.toLowerCase()
  const status = document.getElementById('status-filter').value

  const filtered = allJobs.filter(job => {
    const matchSearch = job.position.toLowerCase().includes(search) ||
                        job.company.toLowerCase().includes(search)
    const matchStatus = !status || job.status === status
    return matchSearch && matchStatus
  })

  renderJobs(filtered)
}

// ===== EDIT / DELETE =====
function startEdit(jobId) {
  const job = allJobs.find(j => j._id === jobId)
  if (!job) return

  document.getElementById('edit-job-id').value = job._id
  document.getElementById('job-position').value = job.position
  document.getElementById('job-company').value  = job.company
  document.getElementById('job-status').value   = job.status
  document.getElementById('job-type').value     = job.jobType || 'full-time'

  document.getElementById('form-panel-title').textContent = 'Edit Application'
  document.querySelector('#job-submit-btn .btn-text').textContent = 'Update Job'
  document.getElementById('cancel-edit-btn').style.display = 'inline-flex'

  showPanel('add')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  resetJobForm()
  showPanel('all')
}

function resetJobForm() {
  document.getElementById('job-form').reset()
  document.getElementById('edit-job-id').value = ''
  document.getElementById('form-panel-title').textContent = 'Add Application'
  document.querySelector('#job-submit-btn .btn-text').textContent = 'Add Job'
  document.getElementById('cancel-edit-btn').style.display = 'none'
  clearErrors()
}

function openDeleteModal(jobId) {
  deleteTargetId = jobId
  document.getElementById('delete-modal').classList.remove('hidden')
}

function closeDeleteModal() {
  deleteTargetId = null
  document.getElementById('delete-modal').classList.add('hidden')
}

// ===== PANELS =====
function showPanel(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))

  document.getElementById(`panel-${name}`).classList.add('active')
  const idx = name === 'all' ? 0 : 1
  document.querySelectorAll('.nav-item')[idx].classList.add('active')

  if (name === 'all') filterJobs()
}

// ===== HELPERS =====
function setLoading(btnId, loading) {
  const btn    = document.getElementById(btnId)
  const text   = btn.querySelector('.btn-text')
  const loader = btn.querySelector('.btn-loader')

  btn.disabled = loading
  text.classList.toggle('hidden', loading)
  loader.classList.toggle('hidden', !loading)
}

function showError(id, msg) {
  const el = document.getElementById(id)
  el.textContent = msg
  el.classList.remove('hidden')
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => {
    el.textContent = ''
    el.classList.add('hidden')
  })
}

let toastTimer = null
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast')
  toast.textContent = msg
  toast.className = `toast ${type}`
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.classList.add('hidden') }, 3000)
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}