export interface PdfPage {
  pageNumber: number
  text: string
  imageDataUrl?: string
}

export interface PdfProcessorService {
  extractPages(file: File): Promise<PdfPage[]>
  getPageCount(file: File): Promise<number>
}
