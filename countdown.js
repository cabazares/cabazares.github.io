const setCountdown = (date) => {
  const urlDate = (new URL(window.location.href)).searchParams.get('date')
  const deadline = (urlDate)? new Date(urlDate) : new Date(date)

  const dayCnt = $('#days > .number')
  const hrsCnt = $('#hours > .number')
  const minCnt = $('#minutes > .number')
  const secCnt = $('#seconds > .number')

  const setDates = () => {
    const now = new Date()
    let seconds = (deadline.getTime() - now.getTime()) / 1000

    if (seconds < 0) {
      seconds = 0
    }

    var days = Math.floor(seconds / (3600 * 24));
    seconds  -= days * 3600 * 24;
    var hours   = Math.floor(seconds / 3600);
    seconds  -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds  -= minutes * 60;

    if (days > 0) {
      dayCnt.text(Math.floor(days))
    } else {
      $('#days').hide()
    }
    hrsCnt.text((Math.floor(hours)).toString().padStart(2, 0))
    minCnt.text((Math.floor(minutes)).toString().padStart(2, 0))
    secCnt.text((Math.floor(seconds)).toString().padStart(2, 0))
  }

  $('#deadline').text(moment(deadline).format('LLLL'))

  return setInterval(setDates, 1000)
}

