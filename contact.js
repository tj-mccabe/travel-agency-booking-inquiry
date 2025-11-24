const destinationAvailability = {
  "Paris": { flag: "Flags/france.png", availableFrom: "2025-06-01", price: 700 },
  "Rome": { flag: "Flags/italy.png", availableFrom: "2025-05-15", price: 750 },
  "Barcelona": { flag: "Flags/spain.png", availableFrom: "2025-07-01", price: 680 },
  "Amsterdam": { flag: "Flags/netherlands.png", availableFrom: "2025-06-10", price: 720 },
  "Tokyo": { flag: "Flags/japan.png", availableFrom: "2025-08-01", price: 1200 },
  "Bangkok": { flag: "Flags/thailand.png", availableFrom: "2025-04-20", price: 1100 },
  "Seoul": { flag: "Flags/south_korea.png", availableFrom: "2025-09-01", price: 1150 },
  "Bali": { flag: "Flags/indonesia.png", availableFrom: "2025-04-01", price: 1050, discount: 40 },
  "New York": { flag: "Flags/usa.png", availableFrom: "2025-05-01", price: 950 },
  "Toronto": { flag: "Flags/canada.png", availableFrom: "2025-06-01", price: 900 },
  "Cancun": { flag: "Flags/mexico.png", availableFrom: "2025-04-01", price: 880 },
  "Sydney": { flag: "Flags/australia.png", availableFrom: "2025-12-01", price: 1400 },
  "Auckland": { flag: "Flags/new_zealand.png", availableFrom: "2025-12-15", price: 1450 },
  "Dubai": { flag: "Flags/uae.png", availableFrom: "2025-05-01", price: 1100, discount: 25 },
  "Swiss Alps": { flag: "Flags/switzerland.png", availableFrom: "2025-12-01", price: 950, discount: 30 }
};

const addOns = {
  insurance: 50,
  tour: 100,
  meal: 70
};

$(document).ready(function () {
  const $destinationDropdown = $('#destinationDropdown');
  const $dropdownOptions = $destinationDropdown.find('.custom-dropdown-options');
  const $selectedText = $destinationDropdown.find('.custom-dropdown-selected span');
  const $arrow = $destinationDropdown.find('.arrow');
  let selectedDestinationName = '';

  Object.entries(destinationAvailability).forEach(([destination, { flag, availableFrom, discount }]) => {
    let optionText = `${destination} (${availableFrom})`;
    if (discount) {
      optionText = `${destination} (${availableFrom}) - ${discount}% OFF!`;
    }
    
    const optionHTML = 
      `<div class="custom-dropdown-option" data-destination="${destination}">
        <span class="flag">
          ${flag.includes("Flags/") ? `<img src="${flag}" alt="${destination} flag" class="flag-img">` : flag}
        </span>
        <span>${optionText}</span>
      </div>`;
    $dropdownOptions.append(optionHTML);
  });

  // Calculate price with discount if applicable
  function getDestinationPrice(destinationName) {
    const destination = destinationAvailability[destinationName];
    if (!destination) return 0;
    
    let price = destination.price;
    if (destination.discount) {
      price = price * (1 - destination.discount / 100);
    }
    return price;
  }

  // Calculate total price with travellers and add-ons
  function calculateTotalPrice() {
    const travellers = parseInt($('#travellers').val()) || 0;
    const basePrice = getDestinationPrice(selectedDestinationName);

    let total = basePrice * travellers;

    // Add the cost of selected add-ons
    $('.addon:checked').each(function () {
      const addonValue = $(this).val();
      if (addOns[addonValue]) {
        total += addOns[addonValue] * travellers;
      }
    });

    return total;
  }

  // Update price display and breakdown
  function updatePriceDisplay() {
    const travellers = parseInt($('#travellers').val()) || 0;
    const destination = destinationAvailability[selectedDestinationName];
    if (!destination) return;
    
    const originalPrice = destination.price;
    const discount = destination.discount || 0;
    const discountedPrice = getDestinationPrice(selectedDestinationName);

    // Calculate total price based on the number of travellers
    let total = discountedPrice * travellers;

    // Breakdown of price and add-ons
    let priceBreakdown = [];
    let addOnDetails = [];

    const addOnsChecked = {
      insurance: $('#insurance').is(':checked'),
      tour: $('#tour').is(':checked'),
      meal: $('#meal').is(':checked'),
    };

    // Price breakdown with discount (if applicable)
    if (discount) {
      priceBreakdown.push(`Original Price: £${originalPrice} per traveller`);
      priceBreakdown.push(`Discount: ${discount}% OFF!`);
      priceBreakdown.push(`Discounted Price: £${discountedPrice.toFixed(2)} x ${travellers} traveller(s) = £${(discountedPrice * travellers).toFixed(2)}`);
    } else {
      priceBreakdown.push(`Base Price: £${originalPrice} x ${travellers} traveller(s) = £${originalPrice * travellers}`);
    }

    // Add-ons cost breakdown
    if (addOnsChecked.insurance) {
      total += addOns.insurance * travellers;
      addOnDetails.push(`+£${addOns.insurance} (Insurance) x ${travellers} traveller(s) = £${addOns.insurance * travellers}`);
    }
    if (addOnsChecked.tour) {
      total += addOns.tour * travellers;
      addOnDetails.push(`+£${addOns.tour} (Guided City Tour) x ${travellers} traveller(s) = £${addOns.tour * travellers}`);
    }
    if (addOnsChecked.meal) {
      total += addOns.meal * travellers;
      addOnDetails.push(`+£${addOns.meal} (Premium Meals) x ${travellers} traveller(s) = £${addOns.meal * travellers}`);
    }

    // Combine all details into the price summary
    let priceSummaryText = priceBreakdown.join('<br>');
    if (addOnDetails.length > 0) {
      priceSummaryText += '<br>' + addOnDetails.join('<br>');
    }

    priceSummaryText += `<br><strong>Total Price: £${total.toFixed(2)}</strong>`;

    $('#priceSummary').html(priceSummaryText);
  }

  // Toggle dropdown open/close
  $destinationDropdown.on('click', '.custom-dropdown-selected', function () {
    $destinationDropdown.toggleClass('open');
    $arrow.html($destinationDropdown.hasClass('open') ? '&#x25B2;' : '&#x25BC;');
  });

  // Handle destination selection
  $destinationDropdown.on('click', '.custom-dropdown-option', function () {
    selectedDestinationName = $(this).data('destination');
    const destination = destinationAvailability[selectedDestinationName] || {};
    const { flag, availableFrom, discount } = destination;

    let displayText = `${selectedDestinationName} (${availableFrom})`;
    if (discount) {
      displayText = `${selectedDestinationName} (${availableFrom}) - ${discount}% OFF!`;
    }
    
    $selectedText.text(displayText);
    
    // Display the flag below the destination box
    if (flag) {
      $('#flagDisplay').html(`<span class="flag"><img src="${flag}" alt="${selectedDestinationName} flag" class="flag-img"></span>`);
    }

    if (availableFrom) {
      $('#travelDate').attr('min', availableFrom);
      $('#dateNote').text(`* Available from ${availableFrom}`);
    } else {
      $('#travelDate').removeAttr('min');
      $('#dateNote').text('');
    }

    $destinationDropdown.removeClass('open');
    $arrow.html('&#x25BC;');

    updatePriceDisplay();
  });

  // Live updates for travellers and add-ons
  $('#travellers').on('input', updatePriceDisplay);
  $('.addon').on('change', updatePriceDisplay);

  // Form submission
  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();

    const date = $('#travelDate').val();
    const travellers = $('#travellers').val();

    if (!selectedDestinationName || !date || !travellers) {
      $('#formMessage').text('Please fill in all fields.').css('color', 'red');
      return;
    }

    const destination = destinationAvailability[selectedDestinationName];
    const selectedFlag = destination?.flag;
    const availableFrom = destination?.availableFrom;
    const discount = destination?.discount;
    const total = calculateTotalPrice();

    let confirmationMessage = `Inquiry submitted for ${selectedDestinationName} (${availableFrom}) <span class="flag"><img src="${selectedFlag}" alt="${selectedDestinationName} flag" class="flag-img"></span>`;
    
    if (discount) {
      confirmationMessage += `<br><span style="color: #e63946; font-weight: bold;">Special Offer: ${discount}% OFF!</span>`;
    }
    
    confirmationMessage += `<br><strong>Total Price: £${total.toFixed(2)}</strong>`;

    $('#formMessage').html(confirmationMessage).css('color', 'green');
  });
});
