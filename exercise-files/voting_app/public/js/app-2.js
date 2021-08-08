
class ProductList extends React.Component {

    state={
      productList: [],
    };


  render() {
    

    return (
      <div className='ui unstackable items'>

        {this.state.productList.sort((a,b) => (b.votes - a.votes)).map((item) => (
          <Product key={'product-' + item.id} {...item} onVote={this.handleProductUpVote}/>
        ))}
        
      </div>
    );
  }

  //Best practive to Seed the data in componentDidMount and initialize it empty
  componentDidMount(){
    this.setState({
      productList: window.Seed.products,
    });
  }

  handleProductUpVote = (id) => {
    console.log(id);

    const updatedProductList = this.state.productList.map((product) => {
      if(product.id === id){
        return Object.assign({},product,{
          votes:product.votes + 1,
        });
      } else{
        return product;
      }
    });

    this.setState({productList: updatedProductList});
  }
}

class Product extends React.Component {

  render() {
    
    const{id,
      title,
      description,
      url,
      votes,
      submitterAvatarUrl,
      productImageUrl,
      onVote} = this.props;

    return (
      <div className="item">
        <div className="image">
          <img src={productImageUrl}/>
        </div>
        <div className='middle aligned content'>
          <div className='header'>
          <a onClick={this.handleUpVote}>
              <i className='large caret up icon' />
            </a>
            {votes}
          </div>
          <div className='description'>
            <a href={url}>{title}</a>
            <p>{description}</p>
          </div>
          <div className='extra'>
            <span>Submitted by:</span>
            <img
              className='ui avatar image'
              src={submitterAvatarUrl}
            />
          </div>
        </div>
      </div>
    );
  }

  handleUpVote = () => {
    this.props.onVote(this.props.id);
  }
}

ReactDOM.render(
  <ProductList/>, 
  document.getElementById('content')
);
