(function (sha256) {
  var requestor = window.opener || window

  // get the requesting origin
  var origin = requestor.location.origin



  function returnToken(provider) {
    return new Promise(function (resolve, reject) {

      // generate token
      var token = generateIdToken(provider)
      
      // post it back to opening page
      var target = origin === 'null' ? '*' : origin
      requestor.postMessage({token: token}, target)

      // wait for ack
      window.addEventListener('message', function (e) {
          if (e.origin === window.location.origin && e.data === 'ack') {
            resolve()
          }
      })

      // timeout - if promise has already been resolved,
      // this will be ignored
      setTimeout(reject, 10000)

    })

  }

  function generateIdToken(provider) {
    return hash(origin, provider)
  }

  function hash() {
    var args = Array.prototype.slice.call(arguments)
    return sha256(args.join('|')).toString()
  }

  // UI
  document.getElementById('origin').textContent = origin

  Array.prototype.slice.call(document.querySelectorAll('a')).forEach(function (a) {
    console.log('foo', a)
    a.addEventListener('click', function (e) {
      e.preventDefault()
      e.stopImmediatePropagation()

      if (e.target.id === 'add') {
        alert('The browser would somehow let people add an identity provider')
      } else {
        var provider = e.target.id
        returnToken(provider)
          .then(function () {
            console.log('close')
            window.close()
          })
          .catch(function () {
            alert('could not generate token for ' + provider)
          })
      }

    })
  })





})(CryptoJS.SHA256)

