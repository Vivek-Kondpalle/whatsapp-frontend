export type GetContact = {
    label: string;
    value: string;
}

export type GetAllContactsResponse = {
    contacts: GetContact[];
}