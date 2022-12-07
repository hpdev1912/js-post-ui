import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };

  payload?.imageSource === 'piscum' ? delete payload.image : delete payload.imageUrl;

  delete payload.imageSource;

  if (!payload.id) delete payload.id;

  return payload;
}

function JsonToFormData(jsonObj) {
  const formData = new FormData();

  for (const key in jsonObj) {
    formData.set(key, jsonObj[key]);
  }

  return formData;
}

async function handleFormSubmit(formValues) {
  try {
    //check add/edit post
    //=>S1 base on search params
    // const url = new URL(window.location);
    // const postId = url.searchParams.get('id');
    //=>S2 id from formValues
    // let savedPost = null;
    // if (formValues.id) {
    //   savedPost = await postApi.update(formValues);
    // } else {
    //   savedPost = await postApi.add(formValues);
    // }
    const payload = removeUnusedFields(formValues);

    const formData = JsonToFormData(payload);
    console.log('formData', formData);
    //call API
    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    //show toast message

    toast.success('The post was saved!');
    //redirect to detail page

    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('error when submit form', error);
    toast.error(`Error: ${error.message}`);
  }
}

//main
(async () => {
  try {
    const url = new URL(window.location);
    const postId = url.searchParams.get('id');
    let defaultPostValue = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        };
    initPostForm({
      formId: 'postForm',
      defaultPostValue,
      onSubmit: handleFormSubmit, //because the data were sent from child to parent
    });
  } catch (error) {
    console.log('Failed to load post by id', error);
  }
})();
