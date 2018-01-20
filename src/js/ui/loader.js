// Bind the loader to global jquery ajax calls
// $(document).ajaxStart(function() {
//   console.log('Ajax start');
//
//   var loader = $('#loader');
//
//   if (!loader) {
//
//     $('body').append('<div class="loader" id="loader" style="z-index:auto"><svg viewBox="0 0 32 32" width="32" height="32"><circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle></svg></div>');
//
//   } else { return; }
//
// });
//
// $(document).ajaxComplete(function() {
//
//   while ( $.active > 0) {
//     console.log('Ajax has ended but some remain: ', $.active);
//     return;
//   }
//
//   var loader = $('#loader');
//
//   if (loader) {
//
//     $('body').remove('#loader');
//   }
//
//   console.log('All ajax have ended');
//
// });
