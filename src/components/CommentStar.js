import React from 'react';



function CommentStar({ nowStar, setScore}) {
    let stars = [1,2,3,4,5]
        let shows = Object.keys(stars).map((item, index) => {
            return <div key={index} className={nowStar > index ? 'star big' : 'empty-star big'} onClick={() => { setScore(index+1) }}></div>
        })
        return <div className='star-comment'>
            <div className="clear">{shows}</div>
            <div></div>
        </div>
}
export default CommentStar