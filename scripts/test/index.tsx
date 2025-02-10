console.log(<div>content</div>);
console.log(<div>{0}</div>);
console.log(<div>{null}</div>);
console.log(<div>{[0, 1, 2]}</div>);
console.log(
  <div>
    <span>children</span>
    <span>children</span>
  </div>,
);
console.log('---');
console.log(<div title="title">attribute string</div>);
console.log(<input disabled value="attribute boolean" />);
console.log('---');
console.log(<div class="class">class string</div>);
console.log(<div class={['class1', 'class2']}>class array</div>);
console.log(<div class={{ class1: true, class2: false }}>class object</div>);
console.log('---');
console.log(<div style="color: red;">style string</div>);
console.log(<div style={{ color: 'red', fontSize: '16px' }}>style object</div>);
console.log('---');

function App() {
  return <div>App</div>;
}
console.log(<App />);
