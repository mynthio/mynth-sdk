export class Task {
  private readonly data: {
    id: string;
  };

  constructor(data: { id: string }) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }
}
