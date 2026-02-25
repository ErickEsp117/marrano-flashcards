import * as pdfjsLib from 'pdfjs-dist'
import type { PdfProcessorService, PdfPage } from '@/domain/services/PdfProcessorService'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export class PdfJsProcessorService implements PdfProcessorService {
  async extractPages(file: File): Promise<PdfPage[]> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const pages: PdfPage[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)

      const textContent = await page.getTextContent()
      const text = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')

      let imageDataUrl: string | undefined
      try {
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = new OffscreenCanvas(viewport.width, viewport.height)
        const context = canvas.getContext('2d')!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({
          canvasContext: context as any,
          viewport,
        } as any).promise
        const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })
        imageDataUrl = await this.blobToDataUrl(blob)
      } catch {
        // Image rendering failed, continue with text only
      }

      pages.push({ pageNumber: i, text, imageDataUrl })
    }

    return pages
  }

  async getPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    return pdf.numPages
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }
}
