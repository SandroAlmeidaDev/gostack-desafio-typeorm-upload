import { Router } from 'express';

import CreateCompanyService from '../services/CreateCompanyService';

const companiesRouter = Router();

companiesRouter.post('/', async (request, response) => {
  const {
    cnpj,
    state_registration,
    comapany_name,
    fantasy_name,
    adress,
    number,
    district,
    complement,
    zip_code,
    city,
    state,
    commercial_phone,
    cell_phone,
  } = request.body;

  const createCompany = new CreateCompanyService();

  const company = await createCompany.execute({
    cnpj,
    state_registration,
    comapany_name,
    fantasy_name,
    adress,
    number,
    district,
    complement,
    zip_code,
    city,
    state,
    commercial_phone,
    cell_phone,
  });

  return response.json(company);
});

export default companiesRouter;
