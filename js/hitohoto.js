(function() {
  loadData();
  function loadData() {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', '/hitohoto.json', true);
          xhr.onload = function() {
              if (this.status >= 200 && this.status < 300) {
                  var res = JSON.parse(this.response||this.responseText);
                  var hitokotoData = res instanceof Array ? res : res.posts;
                  success(hitokotoData);
              } else {
                  console.error(this.statusText);
              }
          };
          xhr.onerror = function() {
              console.error(this.statusText);
          };
          xhr.send();
  }
  function success(hitokotoData){
      var hitokoto = document.getElementById('hitokoto');
      var from = document.getElementById("from");
      var index = Math.floor(Math.random() * hitokotoData.length);
      hitokoto.innerHTML = hitokotoData[index].hitokoto;
      from.innerHTML = '-- '+hitokotoData[index].from;
  }
})();