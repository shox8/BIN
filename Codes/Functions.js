const foo = (a) => (b) => (c) => {
    console.log(a + b + c);
};

foo(1)(2)(3);

// ! ------------------------------

const plus = (a, b) => {
    console.log(a + b);
};

plus(1, 2);

// ! ------------------------------

function sortArgs() {
    var args = [];
    args.push(...arguments);
    console.log(args.sort());
}

sortArgs(2, 6, 1, 9);

// ! ------------------------------

const middleware = (text) => {
    return text.length;
};

const text = (text) => (m) => {
    console.log(m(text));
};

text("hello")(middleware);

// ! ------------------------------
