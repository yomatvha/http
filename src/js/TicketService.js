import createRequest from './createRequest';
import TicketForm from './TicketForm';

export default class TicketService {
  constructor(element) {
    this.element = element;
    this.changeForm = document.querySelector('.change-ticket');
    this.changeButtons = document.getElementsByClassName('ticket-change-button');
    this.deleteForm = document.querySelector('.delete-ticket');
    this.deleteButtons = document.getElementsByClassName('ticket-delete-button');
    this.tickets = document.getElementsByClassName('ticket');
    this.statusButtons = document.getElementsByClassName('ticket-status-button');
  }

  async init() {
    const params = {
      options: {
        method: 'allTickets',
      },
      parameter: 'GET',
    };
    this.getTickets(await createRequest(params));
    this.createForm = new TicketForm(this);
    this.createForm.init();
    
    this.element.querySelector('.ticket-create-button').addEventListener('click', this.createNewTicket.bind(this));
    this.createListeners(this.changeButtons, this.changeTicketForm);
    this.createListeners(this.deleteButtons, this.deleteTicketForm);
    this.createListeners(this.tickets, this.showTicketDescription);
    this.createListeners(this.statusButtons, this.changeStatus);
  }

  createListeners(elems, method) {
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i];
      elem.addEventListener('click', method.bind(this));
    }
  }

  createNewTicket(e) {
    e.preventDefault();
    this.createForm.open(e.target);
  }

  getTickets(response) {
    const tickets = document.querySelector('.tickets');
    response.forEach((ticket) => {
      const data = new Date(ticket.created).toLocaleDateString('ru', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', '');
      const insert = `<li class="ticket" data-index="${ticket.id}">
            <button class="ticket-status-button"></button>
            <span class="ticket-name">${ticket.name}</span>
            <span class="ticket-create-data">${data}</span>
            <button class="ticket-change-button"></button>
            <button class="ticket-delete-button">X</button>
            <div class="ticket-description hidden" data-name="change-description">${ticket.description}</div>
            `;
      tickets.insertAdjacentHTML('beforeEnd', insert);
      if (ticket.status === true) {
        const element = tickets.querySelector(`[data-index="${ticket.id}"]`);
        const statusButton = element.querySelector('.ticket-status-button');
        statusButton.classList.add('status-true');
      }
    });
  }

  changeTicketForm(e) {
    e.preventDefault();
    const ticket = e.target.closest('li');
    this.changeForm.classList.remove('hidden');
    const shortDescription = this.changeForm.querySelector('[data-name="change-name"]');
    const detailedDescription = this.changeForm.querySelector('[data-name="change-description"]');
    shortDescription.value = ticket.querySelector('.ticket-name').textContent;
    detailedDescription.value = ticket.querySelector('.ticket-description').textContent;
    this.ticketId = ticket.dataset.index;
    const ticketStatusButton = ticket.querySelector('.ticket-status-button');
    this.ticketStatus = false;
    if (ticketStatusButton.classList.contains('status-true')) {
      this.ticketStatus = true;
    }
    const changeFormCloseButton = this.changeForm.querySelector('.add-ticket-cancel-button');
    const changeFormSubmitButton = this.changeForm.querySelector('.add-ticket-submit-button');
    changeFormCloseButton.addEventListener('click', this.changeFormClose.bind(this));
    changeFormSubmitButton.addEventListener('click', this.changeFormSubmit.bind(this));
  }

  changeFormClose(e) {
    e.preventDefault();
    this.changeForm.classList.add('hidden');
  }

  async changeFormSubmit(e) {
    e.preventDefault();
    const shortDescription = this.changeForm.querySelector('[data-name="change-name"]');
    const detailedDescription = this.changeForm.querySelector('[data-name="change-description"]');
    const params = {
      options: {
        method: 'updateById',
        id: this.ticketId,
        name: shortDescription.value,
        description: detailedDescription.value,
        status: this.ticketStatus,
      },
      parameter: 'PUT',
    };
    this.changeForm.classList.add('hidden');
    await createRequest(params);
    location.reload();
  }

  deleteTicketForm(e) {
    e.preventDefault();
    const ticket = e.target.closest('li');
    this.deleteForm.classList.remove('hidden');
    this.deleteTicketId = ticket.dataset.index;
    const deleteFormCloseButton = this.deleteForm.querySelector('.add-ticket-cancel-button');
    const deleteFormSubmitButton = this.deleteForm.querySelector('.add-ticket-submit-button');
    deleteFormCloseButton.addEventListener('click', this.deleteFormClose.bind(this));
    deleteFormSubmitButton.addEventListener('click', this.deleteFormSubmit.bind(this));
  }

  deleteFormClose(e) {
    e.preventDefault();
    this.deleteForm.classList.add('hidden');
  }

  async deleteFormSubmit(e) {
    e.preventDefault();
    this.params = {
      options: {
        method: 'deleteById',
        id: this.deleteTicketId,
      },
      parameter: 'DELETE',
    };
    this.deleteForm.classList.add('hidden');
    await createRequest(this.params);
    location.reload();
  }

  showTicketDescription(e) {
    if (e.target.classList.contains('ticket-status-button') || e.target.classList.contains('ticket-change-button') || e.target.classList.contains('ticket-delete-button')) {
      return;
    }

    const ticket = e.target.closest('li');
    if (ticket.classList.contains('description-on')) {
      ticket.classList.remove('description-on');
      const ticketDescription = ticket.querySelector('.ticket-description');
      ticketDescription.classList.add('hidden');
      return;
    }

    const tickets = document.querySelectorAll('.ticket');
    for (let i = 0; i < tickets.length; i++) {
      if (tickets[i].classList.contains('description-on')) {
        tickets[i].classList.remove('description-on');
        tickets[i].querySelector('.ticket-description').classList.add('hidden');
      }
    }

    ticket.classList.add('description-on');
    ticket.querySelector('.ticket-description').classList.remove('hidden');
  }

  async changeStatus(e) {
    const ticket = e.target.closest('li');
    const statusButton = ticket.querySelector('.ticket-status-button');
    const ticketId = ticket.dataset.index;
    let status;
    if (statusButton.classList.contains('status-true')) {
      status = false;
    } else {
      status = true;
    }
    const response = await this.getTicketById(ticketId);
    const params = {
      options: {
        method: 'updateById',
        id: response.id,
        name: response.name,
        description: response.description,
        status,
        created: response.created,
      },
      parameter: 'PUT',
    };
    await createRequest(params);
    location.reload();
  }

  async getTicketById(id) {
    const params = {
      options: {
        method: 'ticketById',
        id,
      },
      parameter: 'GET',
    };
    return await createRequest(params);
  }
}
