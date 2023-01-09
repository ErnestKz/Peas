import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { AppContent } from './AppContent.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
/* root.render(<React.StrictMode> <AppContent/> </React.StrictMode>); */
root.render(<AppContent/>);



// child component retrieves a lens to access and change
// the part of state that it is interested in

// then the child component defines its substates in terms
// of that lens

// and i guess each subcomponent i.e a list of input fields
// would have a corresponding datatype in the root app state

// perhaps the child components export some lenses
// from itself
