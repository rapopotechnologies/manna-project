document.addEventListener('DOMContentLoaded', function () {
  const itemRow = document.getElementById('itemRow')

  const addItem = (itemName, imageUrls, etsyURL) => {
    const card = document.createElement('div')
    card.classList.add('col-md-4', 'mb-4')

    let carouselImages = ''
    imageUrls.forEach((url, index) => {
      const imageClass = index === 0 ? 'carousel-item active' : 'carousel-item'
      carouselImages += `
            <div class="${imageClass}">
              <a href="${etsyURL}" target="_blank">
                <img src="${url}" class="d-block w-100" alt="...">
              </a>
            </div>
          `
    })

    card.innerHTML = `
          <div class="card mb-4">
            <div id="carousel${itemName}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
              <div class="carousel-inner">
                ${carouselImages}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel${itemName}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel${itemName}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
            <div class="card-body text-center">
              <h6 class="card-title text-dark">${itemName}</h6>
              <a href="${etsyURL}" target="_blank" class="btn btn-primary">View on Etsy</a>
            </div>
          </div>
        `
    itemRow.appendChild(card)
  }

  // add items below
  const bobb_notes_images = [
    'bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-1.jpg',
    'bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-2.jpg',
    'bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-3.jpg',
    'bookmarks/notes/Notes-Book-of-the-Bible-Bookmarks-4.jpg'
  ]
  addItem(
    'NOTES DESIGN BOOK OF THE BIBLE BOOKMARKS',
    bobb_notes_images,
    'https://www.etsy.com/listing/1622990949/book-of-the-bible-bookmarks-notes-design'
  )
  const bobb_flowers_images = [
    'bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-1.jpg',
    'bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-2.jpg',
    'bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-3.jpg',
    'bookmarks/bundle/Bundle-Book-of-the-Bible-Bookmarks-4.jpg'
  ]
  addItem(
    'FLORAL DESIGN BOOK OF THE BIBLE BOOKMARKS',
    bobb_flowers_images,
    'https://www.etsy.com/listing/1622985103/book-of-the-bible-bookmarks-floral'
  )
  const bobb_bundle_images = [
    'bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-1.jpg',
    'bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-2.jpg',
    'bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-3.jpg',
    'bookmarks/flowers/Flowers-Book-of-the-Bible-Bookmarks-4.jpg'
  ]
  addItem(
    'BOOK OF THE BIBLE BOOKMARKS (BUNDLE)',
    bobb_bundle_images,
    'https://www.etsy.com/listing/1623023143/book-of-the-bible-bookmarks-floral-notes'
  )
  const brt1_images = [
    'journals/BRT/bible-reading-tracker-journal-1.jpg',
    'journals/BRT/bible-reading-tracker-journal-2.jpg',
    'journals/BRT/bible-reading-tracker-journal-3.jpg',
    'journals/BRT/bible-reading-tracker-journal-4.jpg',
    'journals/BRT/bible-reading-tracker-journal-5.jpg',
    'journals/BRT/bible-reading-tracker-journal-6.jpg',
    'journals/BRT/bible-reading-tracker-journal-7.jpg'
  ]
  addItem(
    'BIBLE READING TRACKER',
    brt1_images,
    'https://www.etsy.com/listing/1581433227/digital-bible-reading-tracker-soap'
  )

  const basic_stickers_images = [
    'stickers/basic_stickers/basic_stickers1.jpg',
    'stickers/basic_stickers/basic_stickers2.jpg',
    'stickers/basic_stickers/basic_stickers3.jpg'
  ]
  addItem(
    'BIBLE JOURNAL BASIC STICKERS',
    basic_stickers_images,
    'https://www.etsy.com/listing/1570597712/bible-journal-basic-stickers-vol-01'
  )

  const floral_stickers_images = [
    'stickers/Floral Stickers/floral_stickers1.jpg',
    'stickers/Floral Stickers/floral_stickers2.jpg',
    'stickers/Floral Stickers/floral_stickers3.jpg'
  ]
  addItem(
    'FLORAL LINE DIGITAL STICKERS',
    floral_stickers_images,
    'https://www.etsy.com/listing/1570603120/floral-line-digital-stickers-digital'
  )

})
