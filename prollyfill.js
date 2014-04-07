(function () {

// add picker css
var pickerCss = document.createElement('link')
pickerCss.setAttribute('type','stylesheet')
pickerCss.setAttribute('href','picker.css')
document.head.appendChild(pickerCss)

// var picker = document.createElement('iframe')
// picker.setAttribute('src','picker.html')
// picker.id='webloginPicker'

// Opens the UI for choosing an identity provider.
// In a compliant UA this should be implemented as
// special chrome that is trusted by the user and
// unavailable to regular web pages.
var openPicker = function () {
  return new Promise(function (resolve, reject) {
    var disposition


    // window name should be unguessable
    var windowName = Math.random() +''+ Math.random()
    var picker = window.open('picker.html',windowName,'menubar=no,location=yes,resizable=no,scrollbars=no,status=no,height=250,width=650,screenY=100')
    window.picker = picker
    
    window.addEventListener('message', function (e) {
      // check for token message from identity picker
      if (!disposition && e.data && e.data.token) {
        disposition = true
        picker.postMessage('ack', '*')
        resolve(e.data.token)
      }
    })
    picker.postMessage('opened','*')


    // check for close 
    var closeCheckInterval = setInterval(function () {
      if (picker.closed) {
        clearInterval(closeCheckInterval)
        if (!disposition) {
          reject(new Error('Canceled'))
        }
      }
    }, 100)
  })
}

navigator.login = function () {

  return openPicker()

}


})()