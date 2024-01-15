    import React, { useEffect, useRef, useState } from 'react';
    import $ from 'jquery';
    import emailjs from '@emailjs/browser';
    import './Home.css';
    import axios from 'axios';
    import AddWorkForm from './AddWorkForm';
    import { useNavigate } from 'react-router-dom';

    function Homepage() {
        const [auth, setAuth] = useState(false);
        const [name, setName] = useState('');
        const [profession, setProfession] = useState('');
        const [message, setMessage] = useState('');
        const [successMessage, setSuccessMessage] = useState(false);
        const [values, setValues] = useState({email: '', text: '',});
        const [isAddWorkModalOpen, setAddWorkModalOpen] = useState(false);
        const [works, getWorks] = useState([]);
        const [newComment, setNewComment] = useState('');
        const [newCommentName, setNewCommentName] = useState('');        
        const [comments, setComments] = useState([]);
        const nav = useNavigate();

        axios.defaults.withCredentials = true;
        useEffect(() => {
            axios.get("http://localhost:8081/homepage")
            .then(response => {
                if (response.data.status === "Success") {
                    setAuth(true)
                    setName(response.data.name)
                    setProfession(response.data.profession)
                    nav('/homepage');
                } else {
                    setAuth(false)
                    setMessage(response.data.error);
                }
            })
            .then (error => console.log(error));

            axios.get("http://localhost:8081/works", values)
            .then(res => getWorks(res.data))
            .catch(err => console.log(err));

            axios.get("http://localhost:8081/comments")
            .then(response => {
                const fetchedComments = response.data;
                setComments(fetchedComments);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
        
            /* Modal */
            const modalCall = $("[data-modal]");
            const modalClose = $("[data-close]");
        
            modalCall.on("click", function(event) {
            event.preventDefault();
        
            let $this = $(this);
            let modalId = $this.data('modal');
        
            $(modalId).addClass('show');
            $("body").addClass('no-scroll');
        
            setTimeout(function() {
                $(modalId).find(".modal__dialog").css({
                transform: "scale(1)"
                });
            }, 200);
            });
        
            modalClose.on("click", function(event) {
            event.preventDefault();
        
            let $this = $(this);
            let modalParent = $this.parents('.modal');
        
            modalParent.find(".modal__dialog").css({
                transform: "scale(0)"
            });
        
            setTimeout(function() {
                modalParent.removeClass('show');
                $("body").removeClass('no-scroll');
            }, 200);
            });
        
            $(".modal").on("click", function(event) {
            let $this = $(this);
        
            $this.find(".modal__dialog").css({
                transform: "scale(0)"
            });
        
            setTimeout(function() {
                $this.removeClass('show');
                $("body").removeClass('no-scroll');
            }, 200);
            });
        
            $(".modal__dialog").on("click", function(event) {
            event.stopPropagation();
            });

        }, []);

        /* Logout */
        const handleLogout = () => {
            axios.post("http://localhost:8081/logout")
            .then(res => {
                nav('/');
            }).catch(err => console.log(err));
          };

        /* Sending form */
        const form = useRef();
        const sendEmail = (e) => {
            e.preventDefault();
        
            emailjs.sendForm(
                'service_1jchka3', 
                'template_gdq4apq', 
                form.current, 
                '6UW93JjE0LgzEkGLW')
            .then((result) => {
                console.log(result.text);
                setSuccessMessage(true);
                setValues({ email: '', text: '' });
            }, (error) => {
                console.log(error.text);
            });
        };

        /* Works */
        const handleAddWork = async (newWork) => {
            try {
                const response = await axios.post('http://localhost:8081/works', newWork);
                console.log(response.data);
            } catch (error) {
                console.error('Error adding work:', error);
            }
        };
        
        const handleDeleteWork = async (workId) => {
            try {
                const response = await axios.delete(`http://localhost:8081/works/${workId}`);
                window.location.reload()
            } catch (error) {
                console.error('Error deleting work:', error);
            }
        };

        const handleAddComment = async () => {
            if (newComment.trim() !== '' && newCommentName.trim() !== '') {
                const timestamp = new Date();
                const formattedTimestamp = timestamp.toLocaleDateString();
                const commentWithTimestamp = {
                    text: `${newComment} (Added on ${formattedTimestamp})`,
                    author: newCommentName,
                };
        
                try {
                    const response = await axios.post('http://localhost:8081/save-comment', {
                        author: commentWithTimestamp.author,
                        commentText: commentWithTimestamp.text,
                    });
        
                    const commentId = response.data.id;
        
                    const updatedComments = [...comments, { ...commentWithTimestamp, id: commentId }];
                    setComments(updatedComments);
                    setNewComment('');
                    setNewCommentName('');
        
                    localStorage.setItem('comments', JSON.stringify(updatedComments));
                } catch (error) {
                    console.error('Error adding comment:', error);
                }
            }
        };

    return (
        <><header className="header">
            <div className="container">
                <div className="header__inner">
                    <div className="user">
                        <div className="user__avatar">
                            <img src="icon.png" height="57" alt=""></img>
                        </div>
                        <div className="user__content">
                            <div className="user__name">{name}</div>
                            <div className="user__prof">{profession}</div>
                            <div>{message}</div>
                        </div>
                    </div>
                    <div className="header__title">
                        <h1>Portfolio</h1>
                    </div>
                    <div className="nav">
                        <a className="nav__link  nav__link--btn" href="#" data-modal="#modal_hire_me">Contact</a>
                        <button className="nav__link  nav__link--btn" type="button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </header>
        
        <div className="modal modal-email" id="modal_hire_me">
                <div className="modal__dialog  modal__dialog--sm">
                    <button className="modal__close" type="button" data-close>
                        <img src="./close.svg" alt="Close"></img>
                    </button>
                    <div className="contact">
                        <div className="contact__left">
                            <h3 className="modal__title mb-0">LET'S TALK!</h3>
                            <h4 className="modal__subtitle">SEND ME A REQUEST</h4>
                            {successMessage && (
                                <div className="success-message">
                                    Form submitted successfully!
                                </div>
                            )}
                            <form className="form" ref={form} onSubmit={sendEmail}>
                                <div className="form__group">
                                    <label className="form__label" htmlFor="input-email">Adress e-mail</label>
                                    <input
                                        required
                                        className="form__input"
                                        name="input-email"
                                        type="email"
                                        id="input-email"
                                        placeholder="Adress e-mail"
                                        value={values.email}
                                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                                    />                              
                                </div>
                                <div className="form__group">
                                    <label className="form__label" htmlFor="input-text">Request</label>
                                    <textarea
                                        required
                                        className="form__textarea"
                                        name="input-text"
                                        id="input-text"
                                        placeholder="Type your request..."
                                        value={values.text}
                                        onChange={(e) => setValues({ ...values, text: e.target.value })}
                                    />                              
                                </div>
                                <div className="text-right">
                                    <button className="btn" type="submit">SEND</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="works" id="work">
                <div className="container">

                <div className="works__header">
                <h1 className='works__title'>My works</h1>
                    <button 
                        className="btn btn-add" 
                        onClick={() => setAddWorkModalOpen(true)} 
                        data-modal="#modal_add_work"
                    >
                        Add Work
                    </button>
                    {isAddWorkModalOpen && (
                        <AddWorkForm 
                            onAddWork={handleAddWork} 
                            onClose={() => setAddWorkModalOpen(false)} 
                        />
                    )}
                </div>

                    <div className="portfolio" id="portfolio">
                        {works.map((work) => (
                        <div className="portfolio__col" key={work.id}>
                            <div className="work" data-modal={`#modal_project_${work.id}`}>
                            <div className="work__content">
                                <div className="work__title">
                                    {work.title}
                                    <time className="work__date">
                                        {new Date(work.date).toLocaleDateString()}
                                    </time>
                                </div>
                                <div className="work__description">
                                    {work.description}
                                </div>
                                <div className="work__link">
                                    Github link: <a href='{work.link}'>{work.link}</a>
                                </div>
                            </div>
                            </div>
                            <div className='buttons'>
                                <button className="btn" onClick={() => handleDeleteWork(work.id)}>Delete</button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            <section>
                <div className='form__comments'>
                    <div className='inputs__comments'>
                        <input
                            type="text"
                            id="input-name"
                            name="input-name"
                            value={newCommentName}
                            placeholder='Your name...'
                            onChange={(e) => setNewCommentName(e.target.value)}
                        />
                        <textarea
                            required
                            name="comment-text"
                            value={newComment}
                            placeholder='Your comment...'
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </div>
                    <p>
                        Welcome! Here, you have the opportunity to leave your comment. 
                        Express your thoughts, share your impressions, or ask any questions. We value 
                        your engagement and look forward to a constructive dialogue. Thank you for participating!
                        <button className="btn" onClick={handleAddComment}>Add comment</button>
                    </p>
                </div>

                <div className='comments'>
                    <p className='comments__title'>All comments</p>
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                        <p>
                            <span>{comment.author}:</span> {comment.text}
                        </p>
                        </div>
                    ))}
                </div>
                </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer__inner">
                        <div className="footer__copyright">
                            &copy; 2024 - Portfolio
                        </div>
                        <div className='nav'>
                            <a className="footer__nav-link  footer__nav-link--btn" href="#" data-modal="#modal_hire_me">Contact</a>
                            <button className="footer__nav-link  footer__nav-link--btn" type="button" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </footer></>
    );
}

export default Homepage;
