$(document).ready(() => {
    let apiToken = $("#apiToken").text();
    $("#modal-button").click(() => {
        $(".modal-body").html("");
        $.get(`/api/events?apiToken=${apiToken}`, (results = {}) => {
            let data = results.data;
            if (!data || !data.events) return;
            data.events.forEach((event) => {
                $(".modal-body").append(
                    `<div>
                    <span class="event-title">
                    ${event.title}
                    </span>
                    <div class="event-description">
                    ${event.description}
                    </div>
                    <button class="join-button" data-id="${event._id}">
                    Join
                    </button>
                    </div>`
                );
            });
        }).then(() =>{
            addJoinButtonListener(apiToken);
        })
    });
});


let addJoinButtonListener = (token) => {
    $(".join-button").click((event) => {
      let $button = $(event.target),
        eventId = $button.data("id");
      $.get(`/api/events/${eventId}/join?apiToken=${token}`, (results = {}) => {
        let data = results.data;
        if (data && data.success) {
          $button
            .text("Joined")
            .addClass("joined-button")
            .removeClass("join-button");
        } else {
          $button.text("Try log in first ");
        }
      });
    });
  };

