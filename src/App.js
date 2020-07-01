import React, {useEffect, useState} from 'react';
import { Form, Field } from 'react-final-form'

const FormElement = (props) => {
  const [name, setName] = useState(null)
  const [file, setFile] = useState(null)
  useEffect(() => {
    props.input.onChange({
      name,
      file,
    });
    //did mount, should run only once
    // eslint-disable-next-line
  }, [])
  return (
    <>
      <input onChange={e => {
        const name = e.target.value;
        props.input.onChange({
          name,
          file,
        });
        setName(name);
      }} />
      <input type="file" onChange={e => {
        const file = URL.createObjectURL(e.target.files[0]);
        props.input.onChange({
          name,
          file,
        });
        setFile(file);
      }} />
      {props.meta.touched && props.meta.error && (
        <div>
          {props.meta.error}
        </div>
      )}
      <br />
    </>
  )
}

const validateImageSize = async file => new Promise(resolve => {
  const image = new Image()
  image.onload = () => {
    const valid = image.width <= 1000 && image.height <= 1000;
    resolve(valid? undefined : 'Image size is at most 1000 x 1000')
  }
  image.src = file;
})

const validateImage = async image => {
  if (!image) {
    return;
  }
  if (!image.name || !image.file) {
    return 'Specify image and file';
  }
  return validateImageSize(image.file);
}

function App() {
  const [images, setImages] = useState([]);
  const [ids, setIds] = useState([]);

  return (
    <>
      <Form
        onSubmit={data => {
          setImages([...images, ...data.images]);
          setIds([]);
        }}
      >
        {
          ({
            handleSubmit
          }) => (
            <form onSubmit={handleSubmit}>
              {ids.map((id, i) => (
                <Field
                  key={id}
                  name={`images[${i}]`}
                  component={FormElement}
                  validate={validateImage}
                />
              ))}
              <button
                type="button"
                onClick={() => setIds([...ids, new Date().getTime()])}
              >
                Add image
              </button>
              <br />
              <button type="submit">
                Submit
              </button>
            </form>
          )
        }
      </Form>
      <p>
        Images:
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 20%) 50px 3em 1fr',
            gridTemplateRows: 'repeat(5, 20%)',
          }}
        >
          {images.map(image => (
            <div>
              <strong>
                {image.name}
              </strong>
              <br />
              <img style={{maxWidth: '100%'}} alt="" src={image.file} />
            </div>
          ))}
        </div>
      </p>
    </>
  );
}

export default App;
