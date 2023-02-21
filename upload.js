function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toLocaleString()} ${sizes[i]}`
}

const element = (tag, classes = [], content) => {//хелпер функция
  const node = document.createElement(tag)
  if (classes.length) {
    node.classList.add(...classes)
  }
  if (content) {
    node.textContent = content
  }
  return node
}

function noop() { }

export function upload(selector, options) {
  let files = []
  const input = document.querySelector(selector)

  const onUpload = options.onUpload ?? noop
  const preview = element('div', ['preview'])
  const open = element('button', ['btn'], 'Открыть')
  const upload = element('button', ['btn', 'primary'], 'Загрузить')
  upload.style.display = 'none'

  input.insertAdjacentElement('afterend', preview)
  input.insertAdjacentElement('afterend', upload)
  input.insertAdjacentElement('afterend', open)

  if (options.multi) {
    input.setAttribute('multiple', true)
  }

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','))
  }

  const triggerInput = () => input.click()// Я и не знал что так можно было
  //видимо проще скрыть инпут и кликнуть на нем программно чем перерисовывать нативный инпут
  const inputHandler = event => {
    // console.log(event.target.files)
    if (!event.target.files.length) return

    files = Array.from(event.target.files)
    // console.log(files, 'из inputHandler');

    preview.innerHTML = ''

    upload.style.display = 'inline-block'

    files.forEach(file => {
      if (!file.type.match('image')) return

      const reader = new FileReader()

      reader.onload = ev => {
        // console.log(ev.target.result)
        const src = ev.target.result
        //события можно вешать только на существующий элемент, для жинамически появляющихся только после появления
        preview.insertAdjacentHTML('afterbegin', /*html*/` 
          <div class="preview-image">
          <div class="preview-remove" data-name="${file.name}">&times;</div>
            <img src="${src}" alt="${file.name}"/>
            <div class="preview-info">
              <div>${file.name}</div><!--спан чтоб flex сработал-->
              ${formatBytes(file.size)}
            </div>
          </div>
        `)
      }

      reader.readAsDataURL(file)
    })
  }

  const removeHandler = event => {
    if (!event.target.dataset.name) return
    const { name } = event.target.dataset
    // console.log(name)
    files = files.filter(file => file.name !== name)

    if (!files.length) upload.style.display = 'none'

    const block = event.target.parentElement
    block.classList.add('removing')

    setTimeout(() => {
      block.remove()
    }, 300);
  }

  const clearPreview = el => {
    el.style.bottom = 0
    el.innerHTML = '<div class="preview-info-progress"></div>'
  }

  const uploadHandler = event => {
    preview.querySelectorAll('.preview-remove').forEach(el => el.remove())
    const previewInfo = preview.querySelectorAll('.preview-info')
    previewInfo.forEach(clearPreview)
    onUpload(files, previewInfo)
  }

  open.addEventListener('click', triggerInput)
  input.addEventListener('change', inputHandler)
  preview.addEventListener('click', removeHandler)
  upload.addEventListener('click', uploadHandler)
}