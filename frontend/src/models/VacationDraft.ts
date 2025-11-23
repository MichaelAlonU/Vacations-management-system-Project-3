export default interface VacationDraft {

    destination: string
    description: string
    startTime: Date;
    endTime: Date;
    price: number;
    imageUrl: string
    image: File
}