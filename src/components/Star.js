

function Star({number}) {
    return <div className='star-comment'>
        <div className="clear"><div className="empty-star"></div><div className="empty-star"></div><div className="empty-star"></div><div className="empty-star"></div><div className="empty-star"></div></div>
        <div></div>
        <div style={{width:`${(number*18+(number)*7.5)/100}rem`}} className="clear top-star"><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div><div className="star"></div></div>
        <div></div>
    </div>
}
export default Star