interface OrderDetails {
  academic_level: string;
  type: string;
  discipline: string;
  topic: string;
  instructions: string;
  files: File[]; 
  page_format: string;
  pages: number;
  amount_payable: string;
  citations: number;
  slides: number;
//   posted_by?: string;
  deadline: string; 
}
