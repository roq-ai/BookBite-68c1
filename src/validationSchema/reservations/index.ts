import * as yup from 'yup';

export const reservationsValidationSchema = yup.object().shape({
  date: yup.date().required(),
  time: yup.date().required(),
  number_of_guests: yup.number().integer().required(),
  table_status: yup.string().required(),
  customer_id: yup.string().nullable(),
  restaurant_id: yup.string().nullable(),
});
