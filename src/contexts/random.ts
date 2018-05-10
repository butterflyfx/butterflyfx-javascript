import * as faker from 'faker';

export default class RandomContext {

    get FirstName(): string {
        return faker.name.firstName();
    }

    get LastName(): string {
        return faker.name.lastName();
    }

    get FullName(): string {
        return faker.name.findName();
    }

    get PhoneNumber(): string {
        return faker.phone.phoneNumber();
    }

    get Email(): string {
        return faker.internet.email();
    }

    get URL(): string {
        return faker.internet.url();
    }

    get Sentence(): string {
        return faker.lorem.sentence();
    }

    get Paragraph(): string {
        return faker.lorem.paragraph();
    }

    get Number(): string {
        return faker.random.number();
    }

    get UUID(): string {
        return faker.random.uuid();
    }

    get GUID(): string {
        return this.UUID;
    }
}
