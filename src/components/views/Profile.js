import React, { useState, useRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MediaControlCard from '../elements/MediaControlCard';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useParams } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';

const axios = require('axios').default;

const style = {
  image: {
    width: '100%',
    height: 600,
  },
  detailImage: {
    width: '316px',
    height: '367px',
  },
  container: {
    width: '80%',
    margin: 'auto',
  },
  titlePanner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    margin: 'auto',
    right: 600,
    height: 450,
  },
  titleFirst: {
    fontWeight: 'bold',
    fontSize: '144px',
    lineHeight: '150px',
    color: 'white',
  },
  titleSecond: {
    fontWeight: 'bold',
    fontSize: '96px',
    lineHeight: '100px',
  },
  description: {
    width: 700,
    position: 'absolute',
    bottom: 200,
    margin: 'auto',
    right: 350,
    height: 20,
    fontSize: '24px',
  },
  cardDescription: {
    padding: 60,
    position: 'relative',
    height: 350,
  },
  cardDescriptionButton: {
    backgroundColor: '#83BB61',
    width: '175px',
    height: '60px',
    borderRadius: '50px',
    fontSize: '24px',
    color: 'white',
    position: 'absolute',
    bottom: 60,
  },
  cardTitle: {
    fontWeight: 500,
    fontSize: '48px',
    lineHeight: '67px',
    color: '#83BB61',
  },
  cardContent: {
    marginTop: 30,
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '33px',
    width: 800,
  },
  form: {
    padding: 80,
    WebkitBoxShadow: '10px 10px 21px 10px rgba(0,0,0,0.21)',
    MozBoxShadow: '10px 10px 21px 10px rgba(0,0,0,0.21)',
    boxShadow: '10px 10px 21px 10px rgba(0,0,0,0.21)',
  },
};

const Profile = () => {
  const username = localStorage.getItem('username');
  const [page, setPage] = useState(1);
  const params = useParams();
  const [product, setProduct] = useState([]);
  const nameRef = useRef('');
  const contentRef = useRef('');
  const addressRef = useRef('');
  const phoneRef = useRef('');
  const imageRef = useRef('');
  const [submit, setSubmit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    content: '',
    type: 'none',
    address: '',
    phone: '',
    image: '',
  });

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/demo/api/books/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    const index = product.findIndex(p => p.id === id);
    setProduct([...product.slice(0, index).concat(product.slice(index + 1))])
  };

  useEffect(() => {
    axios
      .get('http://localhost:8080/demo/api/books')
      .then((res) => {
        const myProduct = res.data.filter((p) => p.username === params.aName);
        console.log('----MyProduct', myProduct);
        setProduct(myProduct);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [submit]);

  const createProduct = () => {
    const dto = Object.assign(form, {
      name: nameRef.current.value,
      content: contentRef.current.value,
      address: addressRef.current.value,
      phone: phoneRef.current.value,
      image: imageRef.current.value,
      username,
    });
    axios
      .post(`http://localhost:8080/demo/api/books`, dto)
      .then((res) => {
        setSubmit(!submit);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangePage = (e, page) => {
    setPage(page);
  };

  const handleSelectOption = (event) => {
    setForm({ ...form, type: event.target.value });
  };

  const categories = ['General', 'Comic', 'Poem', 'Hardcover', 'Novel', 'Textbook'];
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <img style={style.image} src="/static/images/Profile.png" alt="error" />
        <div style={style.titlePanner}>
          <div style={style.titleFirst}>Book</div>
          <div style={style.titleSecond}>Your Space</div>
        </div>
        <div style={style.description}>
          “Actions are a better reflection of one’s character because it’s easy to say things, but
          difficult to act on them and follow through.”
        </div>
      </div>
      <div style={style.container}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-250px' }}>
            <img style={style.detailImage} src="/static/images/Avatar.png" alt="error" />
          </div>
        </div>
      </div>
      <div style={style.container}>
        <div style={{ marginTop: '150px', fontSize: '48px', fontWeight: '500' }}>Your Book</div>
        <Grid container spacing={3}>
          {product.length === 0
            ? 'No book'
            : product.slice((page - 1 ) * 10, (page - 1) * 10 + 10).map((p) => {
                const { id, name, content, image } = p;
                return (
                  <Grid item xs={12}>
                    <MediaControlCard src={image}>
                      <div style={style.cardDescription}>
                        <Link
                          to={`/product/${id}`}
                          style={{ textDecoration: 'none', color: 'white' }}
                        >
                          <div style={style.cardTitle}>{name}</div>
                        </Link>

                        <div style={style.cardContent}>{content} </div>
                        {username === params.aName ? (
                          <Button style={style.cardDescriptionButton}>
                            <Link
                              to={`/product/${id}`}
                              style={{ textDecoration: 'none', color: 'white' }}
                            >
                              Edit
                            </Link>
                          </Button>
                        ) : null}
                        {username === params.aName ? (
                          <IconButton aria-label="delete" onClick={() => handleDelete(id)}>
                            <DeleteIcon fontSize="large" />
                          </IconButton>
                        ) : null}
                      </div>
                    </MediaControlCard>
                  </Grid>
                );
              })}
        </Grid>
        <Pagination
          count={~~(product.length / 10)}
          onChange={handleChangePage}
          style={{ margin: '30px 650px' }}
          size="large"
        />

        {username === params.aName ? (
          <div>
            <div style={{ marginTop: '150px', fontSize: '48px', fontWeight: '500' }}>
              Create new book
            </div>
            <div style={style.form}>
              <div>Name of book</div>
              <input
                style={{
                  padding: 15,
                  border: '2px solid black',
                  borderRadius: '10px',
                  width: '100%',
                  marginBottom: '30px',
                }}
                ref={nameRef}
                placeHolder="Enter name"
              ></input>
              <div>Description</div>
              <textarea
                style={{
                  padding: 15,
                  border: '2px solid black',
                  borderRadius: '10px',
                  width: '100%',
                  marginBottom: '30px',
                }}
                ref={contentRef}
              ></textarea>
              <div>Categories</div>
              <Select value={form.type} onChange={handleSelectOption} style={{ marginBottom: 30 }}>
                <MenuItem value="none">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => {
                  return <MenuItem value={cat}>{cat}</MenuItem>;
                })}
              </Select>
              <div>Image</div>
              <input
                style={{
                  padding: 15,
                  border: '2px solid black',
                  borderRadius: '10px',
                  width: '100%',
                  marginBottom: '30px',
                }}
                ref={imageRef}
                placeHolder="Enter image"
              ></input>
              <div>Address</div>
              <input
                style={{
                  padding: 15,
                  border: '2px solid black',
                  borderRadius: '10px',
                  width: '100%',
                  marginBottom: '30px',
                }}
                ref={addressRef}
                placeHolder="Enter address"
              ></input>
              <div>Phone</div>
              <input
                style={{
                  padding: 15,
                  border: '2px solid black',
                  borderRadius: '10px',
                  width: '100%',
                  marginBottom: '30px',
                }}
                ref={phoneRef}
                placeHolder="Enter phone"
              ></input>

              <Button
                style={{
                  backgroundColor: '#83BB61',
                  width: 286,
                  height: 80,
                  marginTop: '90px',
                  borderRadius: '50px',
                  fontSize: '24px',
                  color: 'white',
                }}
                onClick={createProduct}
              >
                Create
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
