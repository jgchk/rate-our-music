import { getReleases, setReleases } from '../common/db'

const exportToFile = async () => {
  const releases = await getReleases()
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(releases, undefined, 2)], {
      type: 'application/json',
    })
  )
  await new Promise<void>((resolve) =>
    chrome.downloads.download({ url }, () => resolve())
  )
}

const copyToClipboard = async () => {
  const releases = await getReleases()
  await navigator.clipboard.writeText(JSON.stringify(releases))
}

const clearData = async () => {
  await setReleases({})
}

document
  .getElementById('export')
  ?.addEventListener('click', () => void exportToFile())

document
  .getElementById('clipboard')
  ?.addEventListener('click', () => void copyToClipboard())

document
  .getElementById('clear')
  ?.addEventListener('click', () => void clearData())
