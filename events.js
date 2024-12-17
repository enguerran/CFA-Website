document.querySelectorAll(".addToCalendar").forEach(button => {
    button.addEventListener("click", function () {
        const title = this.getAttribute("data-title");
        const description = this.getAttribute("data-description");
        const location = this.getAttribute("data-location");
        const start = this.getAttribute("data-start");
        const end = this.getAttribute("data-end");

        const cal = ics();

        cal.addEvent(title, description, location, start, end);
        const fileName = title.replace(/\s+/g, "_") + ".ics";
        cal.download(fileName);
    });
});
