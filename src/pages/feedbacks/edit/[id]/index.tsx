import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getFeedbacksById, updateFeedbacksById } from 'apiSdk/feedbacks';
import { Error } from 'components/error';
import { feedbacksValidationSchema } from 'validationSchema/feedbacks';
import { FeedbacksInterface } from 'interfaces/feedbacks';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UsersInterface } from 'interfaces/users';
import { RestaurantsInterface } from 'interfaces/restaurants';
import { getUsers } from 'apiSdk/users';
import { getRestaurants } from 'apiSdk/restaurants';

function FeedbacksEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FeedbacksInterface>(() => `/feedbacks/${id}`, getFeedbacksById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FeedbacksInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFeedbacksById(id, values);
      mutate(updated);
      resetForm();
      router.push('/feedbacks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FeedbacksInterface>({
    initialValues: data,
    validationSchema: feedbacksValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Feedbacks
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="rating" mb="4" isInvalid={!!formik.errors.rating}>
              <FormLabel>Rating</FormLabel>
              <NumberInput
                name="rating"
                value={formik.values.rating}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.rating && <FormErrorMessage>{formik.errors.rating}</FormErrorMessage>}
            </FormControl>
            <FormControl id="comment" mb="4" isInvalid={!!formik.errors.comment}>
              <FormLabel>Comment</FormLabel>
              <Input type="text" name="comment" value={formik.values.comment} onChange={formik.handleChange} />
              {formik.errors.comment && <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UsersInterface>
              formik={formik}
              name={'customer_id'}
              label={'Customer'}
              placeholder={'Select Users'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />
            <AsyncSelect<RestaurantsInterface>
              formik={formik}
              name={'restaurant_id'}
              label={'Restaurant'}
              placeholder={'Select Restaurants'}
              fetcher={getRestaurants}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default FeedbacksEditPage;
