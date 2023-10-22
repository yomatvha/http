import createRequest from './createRequest';

export default class TicketService {
  constructor(element) {
    this.element = element;
    this.createForm = document.querySelector('.add-ticket');
  }

  init() {
    this.createForm.addEventListener('reset', this.createFormClose.bind(this));
    this.createForm.addEventListener('submit', this.createFormSubmit.bind(this));
  }

  open() {
    this.createForm.classList.remove('hidden');
  }

  createFormClose(e) {
    e.preventDefault();
    this.createForm.classList.add('hidden');
    location.reload();
  }

  async createFormSubmit(e) {
    e.preventDefault();
    const shortDescription = this.createForm.querySelector('[data-name="add-name"]');
    const detailedDescription = this.createForm.querySelector('[data-name="add-description"]');
    const params = {
      options: {
        method: 'createTicket',
        id: null,
        name: shortDescription.value,
        description: detailedDescription.value,
        status: false,
        created: null,
      },
      parameter: 'POST',
    };
    this.addTicket(await createRequest(params));
    this.createForm.reset();
    this.createForm.classList.add('hidden');
    location.reload();
  }

  addTicket(response) {
    const tickets = document.querySelector('.tickets');
    const data = new Date(response.created).toLocaleDateString('ru', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
    const insert = `<li class="ticket" data-index="${response.id}">
        <button class="ticket-status-button"></button>
        <span class="ticket-name">${response.name}</span>
        <span class="ticket-create-data">${data}</span>
        <button class="ticket-change-button"></button>
        <button class="ticket-delete-button">X</button>
        <div class="ticket-description hidden" data-name="change-description">${response.description}</div>
        `;
    tickets.insertAdjacentHTML('beforeEnd', insert);
    if (response.status === true) {
      const element = tickets.querySelector(`[data-index="${response.id}"]`);
      const statusButton = element.querySelector('.ticket-status-button');
      statusButton.classList.add('status-true');
    }
  }
}
