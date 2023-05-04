// Here, we wrap the JS that will interact with the DOM in a call to jQuery to ensure that the code isn't run until the browser has finished rendering all the elements. 
$(document).ready(function () {
  // We want appropriate 'ordinal' text to appear with our date, on-screen ("st", "nd" or "rd" after the specific date-numbers listed; "th" after all other date-numbers), so here we declare a 'getOrdinal' function, with the paramater being the 'day'. The 'let' sets the 'suffix' = to the appropriate ordinal, depending on the last digit in the date (the default being "th", since for the majority of dates, this would be the correct ordinal). And then, ultimately, this 'return's the correct ordinal, which is added to the curent date (which is obtained with the next 'let' below).
  function Ordinal(day) {
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }
    return suffix;
  }
  // Here, we declare a 'currentDate' which is assigned the formatted date-string shown and which populates the element with id="currentDay" in the DOM. It uses a 'dayjs' script that we've included in the related HTML, to access current date info. from the 'Day.js' API. 
  let currentDate = dayjs().format('dddd, MMMM D') + Ordinal(dayjs().date());
  $('#currentDay').text(currentDate);

  //Here, we are asking JQuery to run a 'function' 'on' the 'event' (the user's 'click' of the elemet in the DOM with class 'saveBtn') which invokes the 'function', in order to save the 'key'/'value' pairs that we want to store in 'localStorage'. Our 'let' declarations establish the 2 'key/val' pairs we want to track: 1) 'textValue' is set = to capture the 'val'ue of the element 'textarea', within the DOM, where the user will enter their tasks/notes for that hour's activites. 'textValue' is a 'sibling' of 'this' (which in our case here, is the 'button' element in the DOM with class 'saveBtn'). From there, we enter another 'selector' within the (), which is the 'textarea' from which we want to retrieve our value. Whatever content the user enters here, it will be saved as the 'val'ue of the 'button', which we are also going to pair with the next 'let' ('time'), as we want to save these 2 variables in local storage together. 2) 'time' is being set = to the 'id' that is the 'attr'ibute of the 'parent' of the 'saveBtn' in our HTML (the hour of the day we have listed, from 9AM – 5PM). Finally, 'setItem' stores the 'time' and associated 'textValue' (entered by the user, in the text area) in 'localStorage' when the 'saveBtn' related to a specific time on our scheduler is clicked.
  $('.saveBtn').on('click', function () {
    let textValue = $(this).siblings('textarea').val();
    let time = $(this).parent().attr('id');
    localStorage.setItem(time, textValue);
  });

  //Rather than have 'localStorage' 'getItem' at the 'id' 'attr'ibute assigned to the 'parent' of 'time' and 'textValue' (which would require 8 such Jquery commands, 1 for each hour on the schedule), below we establish a 'for' loop based on the value at 'i'. We start 'i' at the first number on our schedulder, '9' (and essentially the '0' position in our 'array' that we have established as comprised of the hours 9AM–5PM, or in military time, '9AM–17PM') to simplify our code. The loop begins and while the value of 'i' is less than 18, we increment up each time the loop runs and if after that the statement is still 'true', the loop runs again.
  for (let i = 9; i < 18; i++) {

    //The 'currentHour' is then accessed through the 'dayjs' API.
    let currentHour = dayjs().hour();
    //This 'if' takes 'i' and checks that it is less than the 'currentHour'. Classes 'past', 'present' and 'future' are all present in our CSS. These styles apply to the 'textarea' assigned to each hour, depeding on the 'currentHour'. If the value of 'i' (the 8 different hours listed on our scheduler) evaluate as being less than the 'currentHour', those are considered to be in the 'past' and we remove the other 2 possible classes (in case they are applied) and 'add' the 'Class' 'past'. The value of each hour on our scheduler is checked in this manner and the appropriate style for each hour is applied, depending on that hour's relationship to 'currentHour'.
    if (i < currentHour) {
      $(`#${i}`).removeClass('present future').addClass('past');
    } else if (i === currentHour) {
      $(`#${i}`).removeClass('past future').addClass('present');
    } else {
      $(`#${i}`).removeClass('past present').addClass('future');
    }

    //Here, we 'get' the 'Item' saved in 'localStorage' (text content input by the user earlier) and display it in the appropriate 'textarea'(s) on the Scheduler, including after page-reloads.
    $(`#${i}`).children('textarea').val(localStorage.getItem(i));
  }
});
// In this way, we retrieve the key/value pairs established above and the data persists, even after the page is reloaded by the user. The user-provided 'val'ue pops back into the 'textarea's, which have all been assigned 'id's that correspond with the 'time' that they represent. And JQuery reassigns that content to the appropriate 'textarea' based on the value that it finds at 'i', each time the page reloads.