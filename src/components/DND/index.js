import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './index.css';
 
//id must be string
const images =[
	{
		id: '1',
		name: 'image1',
		thumb: '../images/img1.jpg',
	},{
    id: '2',
		name: 'image2',
		thumb: '../images/img2.jpg',
  }
  ,{
    id: '3',
		name: 'image3',
		thumb: '../images/img3.jpg',
  }
  ,{
    id: '4',
		name: 'image4',
		thumb: '../images/img4.jpg',
  }
]

const DND = () => {
  const [list, updateList] = useState(images);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateList(items);
  }
	return (
		<div className='container' >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="item">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {list.map(({id, name, thumb}, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <div className='flex' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className="img">
                            <img style={{width: 300 , height: 200}} src={thumb} alt={`${name} `} />
                          </div>
                          <div className='text'>
                            {name}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
		</div>
	)
}

export default DND
