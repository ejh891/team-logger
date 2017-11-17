import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col, FormGroup, FormControl, Button } from 'react-bootstrap';

import Header from '../Header/Header';
import { State } from '../../redux/models/state';
import { User } from '../../redux/models/user';
import { PostBody } from '../../redux/models/postBody';
import * as ratings from '../../maps/ratings';

import { submitPost } from '../../redux/actions/actionCreators';

const style = {
  pooRatingButton: {
    borderRadius: '4px',
    width: '76px',
    height: '62px'
  },
  selectedPooRatingButton: {
    boxShadow: '0 0 3px 2px #663333'
  },
  pooRatingRow: {
    marginTop: '15px'
  }
};

interface CreatePostProps extends RouteComponentProps<{}> {
  user: User;
  submitPost: (post: PostBody) => void;
}

interface CreatePostState {
    rating: number | null;
    comment: string;
}

class CreatePost extends React.Component<CreatePostProps, CreatePostState> {
  constructor(props: CreatePostProps) {
    super(props);

    this.state = {
      rating: null,
      comment: '',
    };

    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handlePostButtonClicked = this.handlePostButtonClicked.bind(this);
    this.renderPooRatingButton = this.renderPooRatingButton.bind(this);
  }

  handleRatingChange(rating: number) {
    this.setState({ rating });
  }

  handleCommentChange(event: React.FormEvent<FormControl>) {
    const target = event.target as HTMLInputElement;

    const comment = target.value;

    this.setState({ comment });
  }

  handlePostButtonClicked() {
    const { rating, comment } = this.state;
    const { user } = this.props;

    if (rating === null || comment.length === 0) { return; }

    const post: PostBody = {
      userId: user.id,
      rating,
      comment,
      timestamp: new Date().getTime(),
      usersWhoLikeThis: []
    };

    this.props.submitPost(post);

    this.props.history.push('/');
  }

  renderPooRatingButton(pooRating: { id: number, imageSrc: string }) {
    let buttonStyle = style.pooRatingButton;
    if (this.state.rating === pooRating.id) {
      buttonStyle = Object.assign({}, buttonStyle, style.selectedPooRatingButton);
    }
    return (
      <img
        style={buttonStyle}
        src={pooRating.imageSrc}
        onClick={() => { this.handleRatingChange(pooRating.id); }}
      />
    );
  }

  render() {
    const { rating, comment } = this.state;
    const { user } = this.props;
    
    if (user === null) {
      return (<Redirect to={{pathname: '/sign-in'}}/>);
    }
    
    return (
      <Grid>
        <Header />
        <Row style={{marginTop: '40px'}}>
          <Col xs={12}>
            <h1>Write a Poost</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>{this.renderPooRatingButton(ratings.content)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.cringe)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.cry)}</Col>
        </Row>
        <Row style={style.pooRatingRow}>
          <Col xs={4}>{this.renderPooRatingButton(ratings.happyContent)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.openSmile)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.scared)}</Col>
        </Row>
        <Row style={style.pooRatingRow}>
          <Col xs={4}>{this.renderPooRatingButton(ratings.surprise)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.tongue)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.wink)}</Col>
        </Row>
        <Row style={style.pooRatingRow}>
          <Col xs={4}>{this.renderPooRatingButton(ratings.flat)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.smile)}</Col>
          <Col xs={4}>{this.renderPooRatingButton(ratings.heart)}</Col>
        </Row>
        <Row style={style.pooRatingRow}>
          <Col xs={12}>
            <FormGroup
              controlId="commentInput"
            >
              <FormControl
                type="text"
                bsSize="large"
                value={comment}
                placeholder="Comment"
                onChange={this.handleCommentChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              disabled={
                rating === null ||
                comment.length === 0
              }
              block={true}
              bsStyle="primary"
              bsSize="large"
              onClick={this.handlePostButtonClicked}
            >
              Post
            </Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state: State) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
    return {
      submitPost: (post: PostBody) => { dispatch(submitPost(post)); }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);