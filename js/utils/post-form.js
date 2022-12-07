import * as yup from 'yup';
import { randomNumber, setBackgroundImage, setElementText, setFieldValue } from './common';

const ImageSource = {
  PISCUM: 'piscum',
  UPLOAD: 'upload',
};

function setFormValue(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title);
  setFieldValue(form, '[name="author"]', formValue?.author);
  setFieldValue(form, '[name="description"]', formValue?.description);
  //temporary save imageUrl easier to get this input was hidden
  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl);

  setBackgroundImage('postHeroImage', formValue?.imageUrl);
}

function getFormValue(form) {
  const formValues = {};

  //Solution 1
  //   ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}"]`);
  //     if (field) formValues[name] = field.value;
  //   });

  //Solution 2: using FormData();
  const formData = new FormData(form);
  for (const [key, value] of formData) {
    formValues[key] = value;
  }
  return formValues;
}

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]');
  if (!titleElement) return;

  //required
  if (titleElement.validity.valueMissing) return 'Please enter title.';

  //at least two words
  if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2)
    return 'Please type at least two words of three characters!';
  return '';
}

function getFormSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title!'),
    author: yup
      .string()
      .required('Please enter author!')
      .test(
        'at-least-two-words',
        'Please enter at least two words!',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image')
      .oneOf([ImageSource.PISCUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PISCUM,
      then: yup
        .string()
        .required('Please choose a background image!')
        .url('Pleas enter a valid url!'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please upload a image from your computer!', (file) =>
          Boolean(file?.name)
        )
        .test('max-3mb', 'The image is too large (less than 3 MB)!', (file) => {
          const fileSize = file?.size || 0;
          const maxSize = 3 * 1024 * 1024;
          return Boolean(fileSize <= maxSize);
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name=${name}]`);
  if (element) {
    element.setCustomValidity(error);
    setElementText(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  //get errors
  // const errors = {
  //   title: getTitleError(form),
  // };

  // //set error messages
  // for (const key in errors) {
  //   const element = form.querySelector(`[name=${key}]`);
  //   if (element) {
  //     element.setCustomValidity(errors[key]);
  //     setElementText(element.parentElement, '.invalid-feedback', errors[key]);
  //   }
  // }

  try {
    //reset previous errors
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));

    //start new validation
    const schema = getFormSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        //flag use for ignoring the log already logged
        if (errorLog[name]) continue;

        //set field error and mark is logged to prevent the message will be override
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  //add class name was-validated to form element (Bootstrap)
  const isValid = form.checkValidity();

  //class was-validated use for showing error on form
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

async function validateFormField(form, formValues, name) {
  try {
    //clear previous error
    setFieldError(form, name, '');

    const schema = getFormSchema();
    await schema.validateAt(name, formValues);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  //show validation on div
  const field = form.querySelector(`[name="${name}"]`);
  if (field && !field.checkValidity()) field.parentElement.classList.add('was-validated');
}

function showLoading(form) {
  const submitButton = form.querySelector('[name="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const submitButton = form.querySelector('[name="submit"]');
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = 'Save';
  }
}

function handleRadioChange(form, selectedValue) {
  const groupControls = form.querySelectorAll('[data-id="imageSource"]');
  groupControls.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSources(form) {
  const groupControls = form.querySelectorAll('[name="imageSource"]');
  groupControls.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      handleRadioChange(form, event.target.value);
    });
  });
}

function initRandomImage(form) {
  const changeImageButton = document.getElementById('postChangeImage');
  if (!changeImageButton) return;

  changeImageButton.addEventListener('click', () => {
    //random ID
    const imageId = randomNumber(1000);
    //build Url
    const imageUrl = `https://picsum.photos/id/${imageId}/1368/400`;
    //set imageUrl for hidden input and background
    setFieldValue(form, '[name="imageUrl"]', imageUrl);

    setBackgroundImage('postHeroImage', imageUrl);
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      //generate imageUrl using URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);

      setBackgroundImage('postHeroImage', imageUrl);

      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image');
    }
  });
}

//validate once filed when change => not wait for submitting
function initValidationOnChange(form) {
  ['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      field.addEventListener('input', (event) => {
        const fieldValue = event.target.value;
        validateFormField(form, { [name]: fieldValue }, name);
      });
    }
  });
}

export function initPostForm({ formId, defaultPostValue, onSubmit }) {
  const postForm = document.getElementById(formId);
  if (!postForm) return;

  //this is an example of closure
  let submitting = false;

  setFormValue(postForm, defaultPostValue);
  initRandomImage(postForm);
  initRadioImageSources(postForm);
  initUploadImage(postForm);
  initValidationOnChange(postForm);

  postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;

    //after submit show loading or disable button to prevent multiple submission
    showLoading(postForm);
    submitting = true;

    //get form value
    const formValues = getFormValue(postForm);
    formValues.id = defaultPostValue.id;
    //validate
    //if valid send to server
    //otherwise show error message
    const isFormValid = await validatePostForm(postForm, formValues);
    if (isFormValid) await onSubmit?.(formValues);

    //hide loading
    hideLoading(postForm);

    submitting = false;
  });
}
