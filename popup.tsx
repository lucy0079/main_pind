import { useState, useEffect } from "react"
import "~popup.css"

function IndexPopup() {
  const [url, setUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        setUrl(tabs[0].url)
      }
    })
  }, [])

  const sendYouTubeLink = async () => {
    if (!url) {
      setMessage("현재 탭의 URL을 가져올 수 없습니다.")
      return
    }

    if (!url.includes("youtube.com/watch?v=")) {
      setMessage("현재 탭은 YouTube 동영상 페이지가 아닙니다.")
      return
    }

    setMessage("링크 전송 중...")
    try {
      const backendUrl = "http://192.168.18.124:9000/extract-ylocations/"
      // const backendUrl = process.env.VITE_BACKEND_URL 
      if (!backendUrl) {
        setMessage("백엔드 URL이 설정되지 않았습니다.")
        return
      }

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ youtube_url: url })
      })

      if (response.ok) {
        const responseData = await response.json()
        setMessage("YouTube 링크가 성공적으로 전송되었습니다!")
        // Send the response data to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: "YOUTUBE_LINK_RESPONSE",
              data: responseData
            })
          }
        })
      } else {
        const errorData = await response.json()
        setMessage(`링크 전송 실패: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      setMessage(`링크 전송 중 오류 발생: ${error.message}`)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "300px"
      }}>
      <h1>YouTube 링크 전송</h1>
      <p>현재 URL: {url || "로딩 중..."}</p>
      <button onClick={sendYouTubeLink} disabled={!url}>
        YouTube 링크 전송
      </button>
      {message && <p style={{ marginTop: "10px", color: message.includes("실패") || message.includes("오류") ? "red" : "green" }}>{message}</p>}
    </div>
  )
}

export default IndexPopup