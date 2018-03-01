const setCountdown = () => {
  const urlDate = (new URL(window.location.href)).searchParams.get('date')
  const deadline = (urlDate)? new Date(urlDate) : new Date('2018-03-04T10:00:00') //new Date('2018-02-23T17:00:00')

  const dayCnt = $('#days > .number')
  const hrsCnt = $('#hours > .number')
  const minCnt = $('#minutes > .number')
  const secCnt = $('#seconds > .number')

  const setDates = () => {
    const now = new Date()
    let seconds = (deadline.getTime() - now.getTime()) / 1000

    var days = Math.floor(seconds / (3600 * 24));
    seconds  -= days * 3600 * 24;
    var hours   = Math.floor(seconds / 3600);
    seconds  -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds  -= minutes * 60;

    dayCnt.text(Math.floor(days))
    hrsCnt.text(Math.floor(hours))
    minCnt.text(Math.floor(minutes))
    secCnt.text(Math.floor(seconds))
  }

  $('#deadline').text(moment(deadline).format('LLLL'))

  return setInterval(setDates, 1000)
}

