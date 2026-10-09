/* ------------------------------------------------------------
   THEORY OF COMPUTATION — Question Bank               # for Last line just search ]);
   Shortcode: TOC
   ------------------------------------------------------------ */
registerQuestionBank([
  // paste your questions here

{
  id: "TOC-FA-0001",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "[15/20] If we consider an arbitrary NFA (non-deterministic finite automaton) with N states in total, the maximum number of states that are there in an equivalent DFA (minimised) is at least:",
  options: ["N!", "2N", "2^N", "N^2", "Not attempted"],
  answer: "2^N",
  explanation: "Converting an NFA with N states to a DFA via subset construction can yield up to 2^N states in the worst-case scenario."
},
{
  id: "TOC-FA-0002",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "[10/20] What is the complement of the language accepted by the NFA shown below? Assume ∑ = {a} and ε is the empty string",
  options: ["a", "Φ", "Not attempted", "{a, ε}", "ε"],
  answer: "Φ",
  explanation: "Assuming the NFA accepts all strings over ∑* = {a}*, the complement of the universal language L = ∑* is the empty set Φ."
},
{
  id: "TOC-FA-0003",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "[8/20] In the theory of automation, how do we represent states?",
  options: ["Not attempted", "Circles", "Double circles", "Arrow", "Rectangle"],
  answer: "Circles",
  explanation: "In state transition diagrams, states are represented by circles (with final states depicted as double circles)."
},
{
  id: "TOC-CFL-0004",
  subject: "Theory of Computation",
  subtopic: "Context Free Languages",
  question: "[7/75] [4/10] Context free languages are closed under ?",
  options: ["union , kleene star", "union, intersection", "Complement , kleene star", "Intersection , complement"],
  answer: "union , kleene star",
  explanation: "Context-free languages are closed under union and Kleene star, but not under intersection or complement."
},
{
  id: "TOC-CFG-0005",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The entity which generate Language is termed as:",
  options: ["Automata", "Tokens", "Grammar", "More Than one of the above", "None of the above"],
  answer: "Grammar",
  explanation: "A grammar is a formal system that generates the strings of a language."
},
{
  id: "TOC-CFG-0006",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The entity which generate Language is termed as:",
  options: ["Automata", "Tokens", "Grammar", "More Than one of the above", "None of the above"],
  answer: "Grammar",
  explanation: "Grammars generate languages, while automata recognize them."
},
{
  id: "TOC-CFG-0007",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following statement is false?",
  options: ["Context free language is the subset of context sensitive language", "Regular language is the subset of context sensitive language", "Context sensitive language is a subset of context free language", "MOTA", "NOTA"],
  answer: "Context sensitive language is a subset of context free language",
  explanation: "Context-free languages are a subset of context-sensitive languages, not the reverse."
},
{
  id: "TOC-CFG-0008",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The entity which generate Language is termed as:",
  options: ["Automata", "Tokens", "Grammar", "MOTA", "NOTA"],
  answer: "Grammar",
  explanation: "A grammar consists of production rules that generate the strings of a language."
},
{
  id: "TOC-CFG-0009",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Production Rule: aAb->agb belongs to which of the following category?",
  options: ["Recursively Ennumerable Language", "Context free Language", "Context Sensitive Language", "MOTA", "NOTA"],
  answer: "Context Sensitive Language",
  explanation: "The rule aAb → agb is context-sensitive because A is replaced by g in the context of a and b."
},
{
  id: "TOC-CFG-0010",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Type checking is normally done during ____________",
  options: ["Lexical Analysis", "Syntax Analysis", "Syntax Directed Translation", "Code generation", "All of the above"],
  answer: "Syntax Directed Translation",
  explanation: "Type checking is typically performed during semantic analysis, often implemented via syntax-directed translation."
},
{
  id: "TOC-CFG-0011",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "A set of tokens, known as?",
  options: ["non-terminals", "terminal symbols", "productions", "start symbol", "All of the above"],
  answer: "terminal symbols",
  explanation: "Tokens correspond to the terminal symbols of the grammar in compiler design."
},
{
  id: "TOC-CFG-0012",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "How many components context-free grammar has?",
  options: ["2", "3", "4", "5", "6"],
  answer: "4",
  explanation: "A CFG is formally defined by a 4-tuple: V, Sigma, R, and S."
},
{
  id: "TOC-CFG-0013",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Context free languages are closed under ?",
  options: ["Intersection , complement", "union, intersection", "Complement , kleene star", "union , kleene star"],
  answer: "union , kleene star",
  explanation: "Context-free languages are closed under union, concatenation, and Kleene star."
},
{
  id: "TOC-CFG-0014",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following was not a part of Chomsky hierarchy..?",
  options: ["Context sensitive grammar", "Unrestricted grammar", "Recursive grammar", "More than one of the above", "None of the above"],
  answer: "Recursive grammar",
  explanation: "The Chomsky hierarchy consists of regular, context-free, context-sensitive, and unrestricted grammars."
},
{
  id: "TOC-DECID-0015",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Recursive languages are also known as..?",
  options: ["sometimes decidable", "undecidable", "decidable", "More than one of the above", "None of the above"],
  answer: "decidable",
  explanation: "Recursive languages are those for which a Turing machine halts and accepts or rejects, making them decidable."
},
{
  id: "TOC-CFG-0016",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following was not a part of Chomsky hierarchy..?",
  options: ["Context sensitive grammar", "Unrestricted grammar", "Recursive grammar", "More than one of the above", "None of the above"],
  answer: "Recursive grammar",
  explanation: "Chomsky hierarchy includes Type 0, 1, 2, and 3 grammars, not recursive grammar."
},
{
  id: "TOC-DECID-0017",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Recursive languages are also known as..?",
  options: ["sometimes decidable", "undecidable", "decidable", "More than one of the above", "None of the above"],
  answer: "decidable",
  explanation: "Recursive languages correspond to problems that are decidable by a Turing machine."
},
{
  id: "TOC-CFG-0018",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following was not a part of Chomsky hierarchy..?",
  options: ["Context sensitive grammar", "Unrestricted grammar", "Recursive grammar", "More than one of the above", "None of the above"],
  answer: "Recursive grammar",
  explanation: "The Chomsky hierarchy consists of regular, context-free, context-sensitive, and unrestricted grammars."
},
{
  id: "TOC-DECID-0019",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Recursive languages are also known as..?",
  options: ["sometimes decidable", "undecidable", "decidable", "More than one of the above", "None of the above"],
  answer: "decidable",
  explanation: "Recursive languages are those for which a Turing machine halts and accepts or rejects, making them decidable."
},
{
  id: "TOC-TUR-0020",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which of the following automatons is the most powerful?",
  options: ["Turing Machine", "Pushdown Automaton", "None of the above", "Finite Automaton"],
  answer: "Turing Machine",
  explanation: "Turing machines are the most powerful computational model among standard automata."
},
{
  id: "TOC-CFG-0021",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The minimum number of productions required to produce a language consisting of palindrome strings over ∑={a,b} is",
  options: ["3", "5", "6", "7"],
  answer: "5",
  explanation: "Generating binary palindromes requires at least 5 context-free grammar production rules."
},
{
  id: "TOC-DECID-0022",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Let L1 be regular language, L2 be a deterministic context free language and L3 a recursively enumerable language, but not recursive. Which one of the following statements is false",
  options: ["L1 ∩ L2 is context free", "L3 ∩ L1 is recursive", "L1 ∪ L2 is context free", "L1 ∩ L2 ∩ L3 is recursively enumerable"],
  answer: "L3 ∩ L1 is recursive",
  explanation: "The intersection of an RE language and a regular language is not necessarily recursive."
},
{
  id: "TOC-DECID-0023",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "For S ∈ (0 + 1) * let d(s) denote the decimal value of s (e.g. d(101) = 5). Let L = {s ∈ (0 + 1)* d(s)mod5 = 2 and d(s)mod7 != 4}. Which one of the following statements is true.",
  options: ["L is recursive, but not context-free", "L is regular", "L is recursively enumerable, but not recursive", "L is context-free, but not regular"],
  answer: "L is regular",
  explanation: "Languages defined by finite modular arithmetic conditions are recognized by finite automata and are regular."
},
{
  id: "TOC-DECID-0024",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Let A ≤m B denotes that language A is mapping reducible (also known as many-to-one reducible) to language B. Which one of the following is FALSE",
  options: ["If A ≤m B and B is undecidable then A is undecidable.", "If A ≤m B and B is recursive then A is recursive.", "If A ≤m B and B is recursively enumerable then A is recursively enumerable.", "If A ≤m B  and B is not recursively enumerable then A is not recursively enumerable."],
  answer: "If A ≤m B and B is undecidable then A is undecidable.",
  explanation: "Reduction A ≤m B means if B is decidable then A is decidable; the converse does not hold."
},
{
  id: "TOC-FA-0025",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "If an Infinite language is passed to Machine M, the subsidiary which gives a finite solution to the infinite input tape is ______________",
  options: ["None of the mentioned", "Loader and Linkers", "Compiler", "Interpreter"],
  answer: "None of the mentioned",
  explanation: "Automata theory models do not rely on software utilities like compilers or loaders to handle infinite inputs."
},
{
  id: "TOC-FA-0026",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Let w be any string of length n is {0,1}*. Let L be the set of all substrings of w. What is the minimum number of states in a non-deterministic finite automaton that accepts L",
  options: ["2n-1", "n+1", "n", "n-1"],
  answer: "n+1",
  explanation: "An NFA recognizing all substrings of a string of length n requires n+1 states."
},
{
  id: "TOC-CFG-0027",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "What is the highest type number that can be assigned to the following grammar? S → Aa A → Ba B → abc",
  options: ["Type 0", "Type 1", "Type 2", "Type 3"],
  answer: "Type 2",
  explanation: "All productions have a single non-terminal on the left, so it is context-free (Type 2); it is not regular because of productions like S → Aa."
},
{
  id: "TOC-DECID-0028",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "If L and P are two recursively enumerable languages, then they are not closed under",
  options: ["Kleene Star L * of L", "Intersection L ∩ P", "Union L ∪ P", "Set Difference"],
  answer: "Set Difference",
  explanation: "Recursively enumerable languages are closed under union, intersection, and Kleene star, but not under set difference or complementation."
},
{
  id: "TOC-FA-0029",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "A language can be generated from simple primitive language in a simple way if and only if",
  options: ["None of the mentioned", "It is recognized by a device of infinite states", "All of the mentioned", "It takes no auxiliary memory"],
  answer: "It takes no auxiliary memory",
  explanation: "Regular languages are recognized by finite automata, which use no auxiliary memory beyond a finite number of states."
},
{
  id: "TOC-FA-0030",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "L is a regular Language if and only If the set of __ classes of IL is finite.",
  options: ["Myhill", "Nerode", "Reflexive", "Equivalence"],
  answer: "Nerode",
  explanation: "According to the Myhill-Nerode theorem, a language is regular if and only if the set of Nerode equivalence classes is finite."
},
{
  id: "TOC-CFG-0031",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The language that a Pushdown Automation accepts in which the stack stays limited to about 10 items is described best as:",
  options: ["Recursive", "Context Free", "Deterministic Context Free", "Regular"],
  answer: "Regular",
  explanation: "A pushdown automaton with a bounded stack size behaves equivalently to a finite automaton, accepting a regular language."
},
{
  id: "TOC-CFG-0032",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Pushdown automata can recognize language generated by_________.",
  options: ["Context free grammar or regular grammar", "Only regular grammar", "Only context sensitive grammar", "Only context free grammar"],
  answer: "Context free grammar or regular grammar",
  explanation: "Pushdown automata are the theoretical machine model for recognizing context-free languages, which include regular languages."
},
{
  id: "TOC-CFG-0033",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The language L= {0i21i | i≥0 } over the alphabet {0,1, 2} is:",
  options: ["is a regular language.", "is recursive and is a deterministic CFL.", "is not a deterministic CFL but a CFL.", "not recursive"],
  answer: "is recursive and is a deterministic CFL.",
  explanation: "The language can be parsed deterministically with a fixed middle marker, making it a deterministic context-free language."
},
{
  id: "TOC-DECID-0034",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Let L1 be a recursive language. Let L2 and L3 be languages that are recursively enumerable but not recursive. Which of the following statements is not necessarily true",
  options: ["L2 ∩ L1 is recursively enumerable", "L1 – L3 is recursively enumerable", "L2 ∪ L1 is recursively enumerable", "L2 – L1 is recursively enumerable."],
  answer: "L1 – L3 is recursively enumerable",
  explanation: "The set difference of a recursive language and an RE language is not necessarily recursively enumerable."
},
{
  id: "TOC-CFG-0035",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "To obtain a string of n Terminals from a given Chomsky normal form grammar, the number of productions to be used is:",
  options: ["n + 1", "2n", "2n - 1", "n 2"],
  answer: "2n - 1",
  explanation: "In CNF, a derivation tree for a string of length n has n terminal nodes and n-1 internal variable nodes, requiring 2n-1 total productions."
},
{
  id: "TOC-CFG-0036",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Let L = L1∩L2, where L1 and L2 are languages as defined below:\n\nL1 = {am bm can bn | m, n >= 0}  L2 = {ai bj ck | i, j, k >= 0}  Then L is",
  options: ["Context free but not regular", "Regular", "Recursively enumerable but not context free.", "Not recursive"],
  answer: "Context free but not regular",
  explanation: "The intersection yields matched counts for a and b, resulting in a context-free language that is not regular."
},
{
  id: "TOC-FA-0037",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Concatenation Operation refers to which of the following set operations:",
  options: ["Kleene", "Dot", "Union", "Two of the options are correct"],
  answer: "Dot",
  explanation: "Language concatenation is represented by the dot operator."
},
{
  id: "TOC-FA-0038",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "The non- Kleene Star operation accepts the following string of finite length over set A = {0,1} | where string s contains even number of 0 and 1",
  options: ["01,0011,010101", "ε,0011,11001100", "01,0011,11001100", "0011,11001100"],
  answer: "ε,0011,11001100",
  explanation: "Strings with an even number of both 0s and 1s include the empty string and strings where counts of each symbol are even."
},
{
  id: "TOC-CFG-0039",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "CFG (Context Free Grammar) is not closed under",
  options: ["Union", "Product", "Kleene star", "Complementation"],
  answer: "Complementation",
  explanation: "Context-free languages are closed under union, concatenation, and Kleene star, but not under intersection or complementation."
},
{
  id: "TOC-CFG-0040",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Let P be a regular language and Q be context-free language such that Q ⊆ P. (For example, let P be the language represented by the regular expression p*q* and Q be {pn qn  | n ∈ N}). Then which of the following is ALWAYS regular?",
  options: ["P ∩ Q", "P - Q", "∑* - P", "∑* - Q"],
  answer: "∑* - P",
  explanation: "The complement of a regular language P is always regular since regular languages are closed under complementation."
},
{
  id: "TOC-FA-0041",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which statement is false regarding pumping lemma for regular languages?",
  options: ["It is sufficient for regularity", "Violating it proves non-regularity", "It applies to all regular languages", "More than one of the above"],
  answer: "It is sufficient for regularity",
  explanation: "The pumping lemma is a necessary condition for regularity, not a sufficient condition."
},
{
  id: "TOC-TUR-0042",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Type-0 grammars generate:",
  options: ["Recursive languages", "Recursively enumerable languages", "CSL", "More than one of the above"],
  answer: "Recursively enumerable languages",
  explanation: "Type-0 grammars (unrestricted grammars) generate exactly the recursively enumerable languages."
},
{
  id: "TOC-FA-0043",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Minimal DFA is unique up to:",
  options: ["State naming", "Transition labels", "Accepting states", "More than one of the above"],
  answer: "State naming",
  explanation: "A minimal deterministic finite automaton is unique except for the names given to its states."
},
{
  id: "TOC-DECID-0044",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Undecidable problems include:",
  options: ["Equivalence of CFLs", "Emptiness of CFLs", "Membership of CFLs", "More than one of the above"],
  answer: "Equivalence of CFLs",
  explanation: "Determining whether two context-free languages are equivalent is undecidable, while emptiness and membership are decidable."
},
{
  id: "TOC-CFG-0045",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "All CFLs are accepted by:",
  options: ["DFA", "NPDA", "DPDA", "More than one of the above"],
  answer: "NPDA",
  explanation: "All context-free languages are accepted by non-deterministic pushdown automata (NPDA)."
},
{
  id: "TOC-CFG-0046",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "{ww | w ∈ {a,b}*} is:",
  options: ["Regular", "CFL", "Not CFL", "More than one of the above"],
  answer: "Not CFL",
  explanation: "The language {ww} requires tracking an unbounded string and matching it, which exceeds the power of pushdown automata."
},
{
  id: "TOC-FA-0047",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "NFA with epsilon transitions has same power as:",
  options: ["DFA", "NFA without epsilon", "PDA", "More than one of the above"],
  answer: "NFA without epsilon",
  explanation: "NFAs with epsilon transitions recognize the exact same class of languages (regular languages) as NFAs without epsilon transitions and DFAs."
},
{
  id: "TOC-CFG-0048",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which is true for inherently ambiguous CFLs?",
  options: ["Every CFG for it is ambiguous", "Some CFG is unambiguous", "All are unambiguous", "More than one of the above", "None of the above"],
  answer: "Every CFG for it is ambiguous",
  explanation: "An inherently ambiguous context-free language has no unambiguous grammar; every possible CFG generating it is ambiguous."
},
{
  id: "TOC-TUR-0049",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "The problem \"Does TM M accept string w?\" is:",
  options: ["Decidable", "Semi-decidable", "Undecidable", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "The acceptance problem for Turing machines is undecidable but semi-decidable (recursively enumerable), so more than one option is correct."
},
{
  id: "TOC-CFG-0050",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "A grammar is ambiguous if:",
  options: ["Some string has multiple parse trees", "Leftmost derivations differ", "Both A and B", "More than one of the above", "None of the above"],
  answer: "Both A and B",
  explanation: "A grammar is ambiguous if there exists a string with multiple parse trees, which corresponds to having more than one leftmost derivation."
},
{
  id: "TOC-FA-0051",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Epsilon-NFA can be converted to DFA with:",
  options: ["Same number of states", "At most 2^n states", "Exponential states", "More than one of the above", "None of the above"],
  answer: "At most 2^n states",
  explanation: "Subset construction converts an NFA/epsilon-NFA with n states into a DFA with at most 2^n states."
},
{
  id: "TOC-FA-0052",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Pumping lemma violates for {a^n b^n | n ≥ 0} showing it is not regular because:",
  options: ["y consists of all a's or all b's", "Pumping changes count equality", "Both A and B", "More than one of the above", "None of the above"],
  answer: "Both A and B",
  explanation: "Pumping the string violates the equal count condition because y contains only a's or only b's."
},
{
  id: "TOC-TUR-0053",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Universal Turing machine can simulate any Turing machine because:",
  options: ["It has infinite tape", "It uses encoding of the target TM", "It has multiple tapes", "More than one of the above", "None of the above"],
  answer: "It uses encoding of the target TM",
  explanation: "A Universal Turing Machine takes the encoded description of any TM and its input to simulate its execution."
},
{
  id: "TOC-CFG-0054",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The language L = {a^n b^n c^n | n ≥ 1} is:",
  options: ["Context-free", "Context-sensitive", "Recursive", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "The language is context-sensitive and also recursive (since all context-sensitive languages are recursive)."
},
{
  id: "TOC-FA-0055",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which of the following is not a valid NFA transition?",
  options: ["On epsilon", "On single symbol", "On multiple symbols simultaneously", "More than one of the above", "None of the above"],
  answer: "On multiple symbols simultaneously",
  explanation: "NFAs accept transitions on a single symbol, epsilon, or empty, but not multiple symbols simultaneously in one step."
},
{
  id: "TOC-DECID-0056",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Ambiguity in context-free grammars is:",
  options: ["Decidable", "Undecidable", "Semi-decidable", "More than one of the above", "None of the above"],
  answer: "Undecidable",
  explanation: "It is well known that determining whether an arbitrary context-free grammar is ambiguous is undecidable."
},
{
  id: "TOC-FA-0057",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "The number of states in minimal DFA for (a+b)*b(a+b){2} is:",
  options: ["3", "4", "5", "More than one of the above", "None of the above"],
  answer: "None of the above",
  explanation: "The minimal DFA must remember the last three symbols, requiring 2^3 = 8 states, so none of the listed numbers is correct."
},
{
  id: "TOC-FA-0058",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "All regular languages are:",
  options: ["Context-free", "Context-sensitive", "Recursive", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "All regular languages are context-free, context-sensitive, and recursive."
},
{
  id: "TOC-FA-0059",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Moore machine differs from Mealy machine in:",
  options: ["Output depends on current state only", "Output depends on current state and input", "Number of states", "More than one of the above", "None of the above"],
  answer: "Output depends on current state only",
  explanation: "In a Moore machine, output depends solely on the current state, whereas in a Mealy machine, it depends on state and input."
},
{
  id: "TOC-DECID-0060",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Post correspondence problem is:",
  options: ["Decidable", "Undecidable", "Recursive", "More than one of the above", "None of the above"],
  answer: "Undecidable",
  explanation: "Post Correspondence Problem (PCP) is a classic undecidable problem in computer science."
},
{
  id: "TOC-CFG-0061",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The language {a^m b^n c^k | m=n or n=k} is:",
  options: ["Regular", "Context-free", "Not context-free", "More than one of the above", "None of the above"],
  answer: "Context-free",
  explanation: "The union of two context-free languages is context-free, and each condition forms a CFL."
},
{
  id: "TOC-DECID-0062",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "The halting problem is:",
  options: ["Decidable for finite automata", "Undecidable for Turing machines", "Decidable for pushdown automata", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "The halting problem is decidable for finite automata and pushdown automata, but undecidable for Turing machines."
},
{
  id: "TOC-FA-0063",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which of the following is true for regular expressions?",
  options: ["Every language defined by a regular expression can be defined by a finite automaton", "Every language defined by a finite automaton can be defined by a regular expression", "Both A and B", "More than one of the above", "None of the above"],
  answer: "Both A and B",
  explanation: "Kleene's theorem proves that regular expressions and finite automata define the exact same class of languages."
},
{
  id: "TOC-CFG-0064",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "A deterministic pushdown automaton is equivalent in power to:",
  options: ["Finite automaton", "Nondeterministic pushdown automaton", "Turing machine", "More than one of the above", "None of the above"],
  answer: "None of the above",
  explanation: "DPDAs recognize deterministic context-free languages, which are strictly less powerful than general NPDAs."
},
{
  id: "TOC-DECID-0065",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "The equivalence of two Turing machines is:",
  options: ["Decidable", "Undecidable", "Semi-decidable", "More than one of the above", "None of the above"],
  answer: "Undecidable",
  explanation: "Determining whether two Turing machines accept the same language is undecidable by reduction from the halting problem."
},
{
  id: "TOC-FA-0066",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Two finite automata are equivalent if they accept:",
  options: ["The same language", "Different languages but same number of states", "Languages with same cardinality", "More than one of the above", "None of the above"],
  answer: "The same language",
  explanation: "Two finite automata are defined as equivalent if and only if they recognize the exact same set of strings."
},
{
  id: "TOC-DECID-0067",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Rice's theorem states that every non-trivial property of recursively enumerable languages is:",
  options: ["Decidable", "Undecidable", "Regular", "More than one of the above", "None of the above"],
  answer: "Undecidable",
  explanation: "Rice's theorem asserts that any semantic property of Turing machines is undecidable."
},
{
  id: "TOC-CFG-0068",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The language {a^n b^n | n ≥ 1} ∪ {a^n b^{2n} | n ≥ 1} is:",
  options: ["Regular", "Context-free but not regular", "Context-sensitive but not context-free", "More than one of the above", "None of the above"],
  answer: "Context-free but not regular",
  explanation: "The union of two context-free languages is context-free, but it cannot be recognized by a finite automaton due to counting requirements."
},
{
  id: "TOC-TUR-0069",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Linear bounded automata accept:",
  options: ["Regular languages", "Context-free languages", "Context-sensitive languages", "More than one of the above", "None of the above"],
  answer: "Context-sensitive languages",
  explanation: "A linear bounded automaton is a restricted Turing machine that accepts exactly the context-sensitive languages."
},
{
  id: "TOC-CFG-0070",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Pumping lemma for context-free languages is used for:",
  options: ["Proving certain languages are not context-free", "Proving a language is infinite", "Both A and B", "More than one of the above", "None of the above"],
  answer: "Proving certain languages are not context-free",
  explanation: "The pumping lemma provides a necessary condition for context-free languages, used to show a language is not CFL."
},
{
  id: "TOC-FA-0071",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "The Chomsky hierarchy is ordered as:",
  options: ["Regular < CFL < CSL < Unrestricted", "CFL < CSL < Unrestricted < Regular", "CSL < Unrestricted < CFL < Regular", "More than one of the above", "None of the above"],
  answer: "Regular < CFL < CSL < Unrestricted",
  explanation: "The Chomsky hierarchy classifies grammars into Type-3 (regular), Type-2 (CFL), Type-1 (CSL), and Type-0 (unrestricted)."
},
{
  id: "TOC-DECID-0072",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which of the following is NOT decidable?",
  options: ["Membership problem for regular languages", "Membership problem for context-free languages", "Whether a Turing machine halts on a given input", "More than one of the above", "None of the above"],
  answer: "Whether a Turing machine halts on a given input",
  explanation: "The halting problem for Turing machines is famously undecidable."
},
{
  id: "TOC-CFG-0073",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "A language is accepted by a pushdown automaton if and only if it is:",
  options: ["Regular", "Context-free", "Context-sensitive", "More than one of the above", "None of the above"],
  answer: "Context-free",
  explanation: "Pushdown automata are the theoretical machine model equivalent in power to context-free grammars."
},
{
  id: "TOC-FA-0074",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "The pumping lemma for regular languages states that for a regular language L, there exists p such that any string w ∈ L with |w| ≥ p can be divided as xyz where |xy| ≤ p, |y| > 0, and xy^i z ∈ L for all i ≥ 0.",
  options: ["True", "False", "Depends on the language", "More than one of the above", "None of the above"],
  answer: "True",
  explanation: "This statement accurately reflects the conditions of the pumping lemma for regular languages."
},
{
  id: "TOC-FA-0075",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which of the following languages is regular?",
  options: ["{a^n b^n | n ≥ 0}", "{a^n b^m | n, m ≥ 0}", "{ww^R | w ∈ {a,b}*}", "More than one of the above", "None of the above"],
  answer: "{a^n b^m | n, m ≥ 0}",
  explanation: "The language {a^n b^m | n, m ≥ 0} can be represented by the regular expression a*b*."
},
{
  id: "TOC-DECID-0076",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which problem is undecidable for PDA?",
  options: ["Emptiness", "Membership", "Equivalence", "More than one of the above", "None of the above"],
  answer: "Equivalence",
  explanation: "Equivalence and ambiguity problems for context-free grammars/PDAs are undecidable."
},
{
  id: "TOC-CFG-0077",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which normal form is used for CFG?",
  options: ["Greibach", "Chomsky", "Both A and B", "More than one of the above", "None of the above"],
  answer: "Both A and B",
  explanation: "Both Chomsky Normal Form (CNF) and Greibach Normal Form (GNF) are standard normal forms for context-free grammars."
},
{
  id: "TOC-TUR-0078",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which is NOT equivalent to Turing Machine?",
  options: ["Multi-tape TM", "Universal TM", "Pushdown Automaton", "λ-calculus", "None of the above"],
  answer: "Pushdown Automaton",
  explanation: "A pushdown automaton has strictly less computational power than a full Turing machine."
},
{
  id: "TOC-FA-0079",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "If L₁ and L₂ are regular, then L₁ − L₂ is:",
  options: ["Regular", "CFL", "Recursive", "More than one of the above", "None of the above"],
  answer: "Regular",
  explanation: "Regular languages are closed under set difference, as L1 - L2 is equivalent to L1 intersection (complement of L2)."
},
{
  id: "TOC-FA-0080",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "A language is regular if and only if it is accepted by:",
  options: ["NFA", "DFA", "ε-NFA", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "DFAs, NFAs, and ε-NFAs all recognize the exact same class of languages: regular languages."
},
{
  id: "TOC-DECID-0081",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which problem is decidable?",
  options: ["Halting of TM", "Emptiness of PDA", "Emptiness of DFA", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "Emptiness for both DFAs and PDAs are decidable problems, unlike the halting problem."
},
{
  id: "TOC-CFG-0082",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which automaton can recognize palindromes?",
  options: ["DFA", "NFA", "PDA", "More than one of the above", "None of the above"],
  answer: "PDA",
  explanation: "Recognizing palindromes requires a stack to remember and match the first half of the string, which a PDA provides."
},
{
  id: "TOC-DECID-0083",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "If L is recursive, then its complement is:",
  options: ["Recursive", "Recursively enumerable", "Not recursive", "More than one of the above", "None of the above"],
  answer: "Recursive",
  explanation: "The class of recursive languages is closed under complementation."
},
{
  id: "TOC-CFG-0084",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which closure property does CFL NOT satisfy?",
  options: ["Union", "Intersection", "Concatenation", "Kleene Star", "None of the above"],
  answer: "Intersection",
  explanation: "Context-free languages are not closed under intersection and complementation."
},
{
  id: "TOC-CFG-0085",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which language is NOT context-free?",
  options: ["{ aⁿbⁿ | n ≥ 0 }", "{ aⁿbⁿcⁿ | n ≥ 0 }", "{ wwᴿ | w ∈ {a,b}* }", "More than one of the above", "None of the above"],
  answer: "{ aⁿbⁿcⁿ | n ≥ 0 }",
  explanation: "The language {a^n b^n c^n} requires tracking three counts simultaneously, which exceeds PDA stack capabilities."
},
{
  id: "TOC-TUR-0086",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which machine accepts exactly the class of recursively enumerable languages?",
  options: ["DFA", "PDA", "Turing Machine", "More than one of the above", "None of the above"],
  answer: "Turing Machine",
  explanation: "Turing machines recognize the class of recursively enumerable (Type-0) languages."
},
{
  id: "TOC-FA-0087",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Pumping lemma is used to prove that a language is:",
  options: ["Regular", "Context-free", "Not regular", "More than one of the above", "None of the above"],
  answer: "Not regular",
  explanation: "The pumping lemma is a negative test used exclusively to prove that certain languages are not regular."
},
{
  id: "TOC-DECID-0088",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which problem is undecidable?",
  options: ["Halting problem", "Emptiness of DFA", "Equivalence of DFA", "More than one of the above", "None of the above"],
  answer: "Halting problem",
  explanation: "The halting problem is a classic undecidable problem in computability theory."
},
{
  id: "TOC-FA-0089",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which operation always preserves regularity?",
  options: ["Intersection", "Complement", "Homomorphism", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "Regular languages are closed under intersection, complement, and homomorphism."
},
{
  id: "TOC-CFG-0090",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which language is accepted by a DFA but not by any PDA?",
  options: ["Regular language", "Context-free language", "Recursive language", "More than one of the above", "None of the above"],
  answer: "None of the above",
  explanation: "Every regular language accepted by a DFA is also accepted by a PDA."
},
{
  id: "TOC-TUR-0091",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which of the following is not primitive recursive but partially recursive?",
  options: ["Carnot function", "Riemann function", "Bounded function", "Ackermann function"],
  answer: "Ackermann function",
  explanation: "The Ackermann function is a classic example of a computable function that is not primitive recursive."
},
{
  id: "TOC-CFG-0092",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which grammar generates context-free language?",
  options: ["Type-0", "Type-1", "Type-2", "More than one of the above", "None of the above"],
  answer: "Type-2",
  explanation: "Chomsky Type-2 grammars correspond to context-free languages."
},
{
  id: "TOC-FA-0093",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which machine accepts exactly the class of regular languages?",
  options: ["Pushdown automata", "Turing machine", "Finite automata", "More than one of the above", "None of the above"],
  answer: "Finite automata",
  explanation: "Finite automata are the computational models that recognize exactly the regular languages."
},
{
  id: "TOC-CFG-0094",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Context free languages are closed under ?",
  options: ["Complement , kleene star", "Intersection , complement", "union, intersection", "union , kleene star"],
  answer: "union , kleene star",
  explanation: "Context-free languages are closed under union, concatenation, and Kleene star, but not intersection or complement."
},
{
  id: "TOC-CFG-0095",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The bottom-up parsing method is also called",
  options: ["Predictive parsing", "Shift reduce parsing", "None of these", "Recursive descent parsing"],
  answer: "Shift reduce parsing",
  explanation: "Bottom-up parsing builds the parse tree from leaves up to the root, primarily using shift and reduce actions."
},
{
  id: "TOC-CFG-0096",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "The top-down parsing method is also called",
  options: ["None of these", "Operator precedence parsing", "Shift reduce parsing", "Recursive descent parsing"],
  answer: "Recursive descent parsing",
  explanation: "Recursive descent is a common top-down parsing technique used in compilers."
},
{
  id: "TOC-CFG-0097",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which automata class can recognize non-regular languages?",
  options: ["Finite State Machine", "Pushdown Automaton", "Turing Machine", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "Both Pushdown Automata and Turing Machines can recognize certain non-regular languages."
},
{
  id: "TOC-CFG-0098",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following is a key property of a Context-Free Grammar (CFG)?",
  options: ["Left Recursion", "Regular Expression Equivalence", "Pushdown Automaton Acceptance", "More than one of the above", "None of the above"],
  answer: "Pushdown Automaton Acceptance",
  explanation: "Context-Free Grammars are recognized by Pushdown Automata, establishing a fundamental equivalence."
},
{
  id: "TOC-CFG-0099",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which type of grammar is required for parsing programming languages?",
  options: ["Regular", "Context-Free", "Context-Sensitive", "More than one of the above", "None of the above"],
  answer: "Context-Free",
  explanation: "Context-free grammars are powerful enough to describe nested structures and syntax of most programming languages."
},
{
  id: "TOC-TUR-0100",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which machine model is the basis of the Church-Turing thesis?",
  options: ["DFA", "PDA", "Turing Machine", "More than one of the above", "None of the above"],
  answer: "Turing Machine",
  explanation: "The Church-Turing thesis uses the Turing Machine as the definition of an effectively calculable function."
},
{
  id: "TOC-CFG-0101",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which type of grammar is required for parsing programming languages?",
  options: ["Regular", "Context-Free", "Context-Sensitive", "More than one of the above", "None of the above"],
  answer: "Context-Free",
  explanation: "Context-free grammars are powerful enough to describe the syntax of programming languages."
},
{
  id: "TOC-TUR-0102",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which machine model is the basis of the Church-Turing thesis?",
  options: ["DFA", "PDA", "Turing Machine", "More than one of the above", "None of the above"],
  answer: "Turing Machine",
  explanation: "The Church-Turing thesis states that a function is effectively calculable if it can be computed by a Turing machine."
},
{
  id: "TOC-CFG-0103",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "In TOC, what does a PDA (Pushdown Automaton) use to store intermediate results?",
  options: ["Queue", "Stack", "Register", "More than one of the above", "None of the above"],
  answer: "Stack",
  explanation: "A pushdown automaton uses an internal stack memory to parse context-free languages."
},
{
  id: "TOC-CFG-0104",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "In TOC, which type of grammar generates context-free languages?",
  options: ["Regular Grammar", "Context-Free Grammar", "Unrestricted Grammar", "More than one of the above", "None of the above"],
  answer: "Context-Free Grammar",
  explanation: "Context-free grammars formally define and generate context-free languages."
},
{
  id: "TOC-DECID-0105",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "What is the main goal of the Halting Problem in TOC?",
  options: ["To determine if a program stops", "To count loops in a program", "To measure execution speed", "More than one of the above", "None of the above"],
  answer: "To determine if a program stops",
  explanation: "The halting problem asks whether a given program will finish running or run forever."
},
{
  id: "TOC-DECID-0106",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which of the following problems is undecidable?",
  options: ["Halting Problem", "Post Correspondence Problem", "Pumping Lemma", "More than one of the above", "None of the above"],
  answer: "More than one of the above",
  explanation: "Both the Halting Problem and the Post Correspondence Problem are classic undecidable problems."
},
{
  id: "TOC-CFG-0107",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "In Theory of Computation, the Chomsky hierarchy classifies languages based on",
  options: ["Computational power of grammars", "Ability to represent real-world problems", "Structural complexity of alphabets", "More than one of the above", "None of the above"],
  answer: "Computational power of grammars",
  explanation: "The Chomsky hierarchy classifies formal grammars by their generative capacity and corresponding machine models."
},
{
  id: "TOC-TUR-0108",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which automaton type is most expressive?",
  options: ["Turing Machine", "Pushdown Automaton", "Finite State Machine", "More than one of the above", "None of the above"],
  answer: "Turing Machine",
  explanation: "Turing machines recognize recursively enumerable languages, making them more powerful than pushdown automata and finite state machines."
},
{
  id: "TOC-COMPL-0109",
  subject: "Theory of Computation",
  subtopic: "Complexity Theory",
  question: "Which complexity class represents problems solvable in polynomial time?",
  options: ["P", "NP", "PSPACE", "More than one of the above", "None of the above"],
  answer: "P",
  explanation: "Class P consists of decision problems solvable by a deterministic Turing machine in polynomial time."
},
{
  id: "TOC-DECID-0110",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which problem is undecidable in Theory of Computation?",
  options: ["Halting Problem", "Regular Language Membership", "Context-Free Language Emptiness", "More than one of the above", "None of the above"],
  answer: "Halting Problem",
  explanation: "The halting problem is a classic undecidable problem proven by Alan Turing using diagonalization."
},
{
  id: "TOC-FA-0111",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "What is a \"regular expression\" used for in Theory of Computation (TOC)?",
  options: ["Defining context-free languages", "Defining regular languages", "Simulating Turing machines", "Designing pushdown automata", "None of the above"],
  answer: "Defining regular languages",
  explanation: "Regular expressions are algebraic notations used to describe regular languages recognized by finite automata."
},
{
  id: "TOC-DECID-0112",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "What is the \"halting problem\" in Theory of Computation (TOC)?",
  options: ["Determining if a Turing machine will eventually halt", "Designing finite state machines", "Defining regular languages", "Compiling programming languages", "None of the above"],
  answer: "Determining if a Turing machine will eventually halt",
  explanation: "The halting problem is a famous undecidable problem about whether a given program will finish running."
},
{
  id: "TOC-COMPL-0113",
  subject: "Theory of Computation",
  subtopic: "Complexity Theory",
  question: "Which of the following statements is TRUE about NP-complete problems?",
  options: ["Every problem in NP can be reduced to an NP-complete problem", "NP-complete problems are easier than P problems", "All NP-complete problems can be solved in polynomial time", "More than one of the above", "None of the above"],
  answer: "Every problem in NP can be reduced to an NP-complete problem",
  explanation: "By definition, an NP-complete problem is one to which every other problem in NP can be reduced in polynomial time."
},
{
  id: "TOC-TUR-0114",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "The Turing Machine is more powerful than a Finite State Machine because:",
  options: ["It has an infinite tape", "It has more states", "It uses a stack for memory", "More than one of the above", "None of the above"],
  answer: "It has an infinite tape",
  explanation: "An infinite tape provides unlimited memory, allowing Turing machines to recognize a broader class of languages than finite state machines."
},
{
  id: "TOC-FA-0115",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "In Theory of Computation, which of the following languages is accepted by a finite automaton?",
  options: ["Context-Free Language", "Regular Language", "Recursive Language", "More than one of the above", "None of the above"],
  answer: "Regular Language",
  explanation: "Finite automata precisely recognize regular languages."
},
{
  id: "TOC-CFG-0116",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following is true about a Context-Free Grammar (CFG)?",
  options: ["Every CFG can be converted into an equivalent DFA", "CFGs are more powerful than regular expressions", "CFGs can generate all possible languages", "More than one of the above", "None of the above"],
  answer: "CFGs are more powerful than regular expressions",
  explanation: "CFGs can describe context-free languages which strictly encompass regular languages."
},
{
  id: "TOC-COMPL-0117",
  subject: "Theory of Computation",
  subtopic: "Complexity Theory",
  question: "The complexity class P is defined as:",
  options: ["The set of problems solvable in polynomial time on a deterministic Turing machine", "The set of problems solvable in polynomial time on a non-deterministic Turing machine", "The set of problems solvable in exponential time", "More than one of the above", "None of the above"],
  answer: "The set of problems solvable in polynomial time on a deterministic Turing machine",
  explanation: "Class P represents problems that can be solved efficiently by a deterministic computer in polynomial time."
},
{
  id: "TOC-CFG-0118",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Push Down Automaton (PDA) can be viewed as a Turing machine that uses .........as the auxiliary memory.",
  options: ["Queue", "Linked List", "Stack", "Heap"],
  answer: "Stack",
  explanation: "A Pushdown Automaton is a finite automaton equipped with a stack."
},
{
  id: "TOC-FA-0119",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which of the following classes of languages can validate an IPv4 address in dotted decimal format? It is to be ensured that the decimal values lie between 0 and 255.",
  options: ["RE and higher", "CFG and higher", "CSG and higher", "Recursively enumerable language"],
  answer: "RE and higher",
  explanation: "IPv4 dotted-decimal validation is a regular language because each octet has a bounded range and fixed format."
},
{
  id: "TOC-FA-0120",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "The process of converting code into tokens is called:",
  options: ["Parsing", "Scanning", "Compiling", "Linking"],
  answer: "Scanning",
  explanation: "Lexical analysis, or scanning, breaks source code into meaningful tokens."
},
{
  id: "TOC-FA-0121",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "The process of converting code into tokens is called:",
  options: ["Parsing", "Scanning", "Compiling", "Linking"],
  answer: "Scanning",
  explanation: "Lexical analysis, or scanning, breaks the source code stream into a series of meaningful tokens."
},
{
  id: "TOC-COMPL-0122",
  subject: "Theory of Computation",
  subtopic: "Complexity Theory",
  question: "If L ∈ NP is a language such that L' ≤p L for some L' ∈ NPC, then:",
  options: ["L, NP-Hard है", "L केवल NP है", "L, NPC है", "L केवल P है"],
  answer: "L, NPC है",
  explanation: "Since L' is NP-complete and reduces to L, L is NP-hard; with L in NP, L is NP-complete."
},
{
  id: "TOC-TURIN-0123",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Who is called the father of Theoretical Computer Science?",
  options: ["एलेन मैथिसन ट्यूरिंग", "जॉन मूचली", "जे.पी. एकर्ट", "इनमें से कोई नहीं"],
  answer: "एलेन मैथिसन ट्यूरिंग",
  explanation: "Alan Turing is considered the father of theoretical computer science and artificial intelligence."
},
{
  id: "TOC-CFG-0124",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "What is called the syntax analysis part in the machine language transformation of a high level language?",
  options: ["Lexical Analysis", "Symantec analysis", "parsing", "linking"],
  answer: "parsing",
  explanation: "Syntax analysis during compilation is commonly known as parsing."
},
{
  id: "TOC-FA-0125",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "According to Chomsky's hierarchy which of the following represents Regular grammar?",
  options: ["TYPE 3", "TYPE 2", "TYPE 1", "MOTA", "NOTA"],
  answer: "TYPE 3",
  explanation: "In Chomsky hierarchy, Type 3 grammars correspond to regular grammars."
},
{
  id: "TOC-CSG-0126",
  subject: "Theory of Computation",
  subtopic: "Chomsky Hierarchy & Grammars",
  question: "According to Chomsky's hierarchy which of the following represents context-sensitive grammar?",
  options: ["TYPE 3", "TYPE 2", "TYPE 1", "MOTA", "NOTA"],
  answer: "TYPE 1",
  explanation: "Type 1 grammars in the Chomsky hierarchy represent context-sensitive grammars."
},
{
  id: "TOC-CFL-0127",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following statement is True?",
  options: ["Every type 2 language is also a type 1 and a type 3", "Every type 2 language is also a type 3 and a type 0", "Every type 2 language is also a type 1 and a type 0", "MOTA", "NOTA"],
  answer: "Every type 2 language is also a type 1 and a type 0",
  explanation: "Type 2 (context-free) languages are a subset of Type 1 (context-sensitive) and Type 0 (unrestricted) languages."
},
{
  id: "TOC-CFG-0128",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Context-free grammar can be recognized by ____.",
  options: ["Finite Automaton", "Pushdown Automaton", "Turing Machine", "MOTA", "NOTA"],
  answer: "Pushdown Automaton",
  explanation: "Context-free grammars are equivalent to pushdown automata in computational power."
},
{
  id: "TOC-TUR-0129",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which of the following automatons is the most powerful?",
  options: ["Finite Automaton", "Pushdown Automaton", "Turing Machine", "More than one of the above", "None of the above"],
  answer: "Turing Machine",
  explanation: "Turing Machines are the most powerful computational model in the Chomsky hierarchy."
},
{
  id: "TOC-FA-0130",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is decidable for DFA?",
  options: ["Equivalence", "Halting", "Acceptance of TM", "PDA equivalence"],
  answer: "Equivalence",
  explanation: "DFA equivalence and emptiness problems are decidable.",
},
{
  id: "TOC-TUR-0131",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which grammar type is unrestricted?",
  options: ["Type-0", "Type-1", "Type-2", "Type-3"],
  answer: "Type-0",
  explanation: "Type-0 grammars correspond to unrestricted grammars accepted by Turing machines.",
},
{
  id: "TOC-FA-0132",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which of the following is equivalent?",
  options: ["DFA & NFA", "PDA & DFA", "TM & PDA", "LBA & DFA"],
  answer: "DFA & NFA",
  explanation: "DFA and NFA have equal computational power and recognize regular languages.",
},
{
  id: "TOC-TUR-0133",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which is a recursively enumerable language?",
  options: ["Accepted by TM", "Accepted by DFA", "Accepted by PDA", "Accepted by LBA"],
  answer: "Accepted by TM",
  explanation: "Recursively enumerable languages are recognized by Turing machines.",
},
{
  id: "TOC-FA-0134",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is NOT true for regular expressions?",
  options: ["Union", "Concatenation", "Kleene star", "Stack operation"],
  answer: "Stack operation",
  explanation: "Stack operations belong to pushdown automata, not regular expressions.",
},
{
  id: "TOC-FA-0135",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is the simplest automaton?",
  options: ["TM", "PDA", "DFA", "LBA"],
  answer: "DFA",
  explanation: "Finite automata are the simplest computational models with no memory beyond states.",
},
{
  id: "TOC-CFG-0136",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which language is not context-free?",
  options: ["a^n b^n", "a^n b^n c^n", "a*b*", "(ab)*"],
  answer: "a^n b^n c^n",
  explanation: "The language a^n b^n c^n requires tracking three counts simultaneously, which context-free grammars cannot do.",
},
{
  id: "TOC-CFG-0137",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following is ambiguous grammar?",
  options: ["Unique parse tree", "Multiple parse trees", "No derivation", "Only left derivation"],
  answer: "Multiple parse trees",
  explanation: "An ambiguous grammar produces more than one parse tree for at least one string.",
},
{
  id: "TOC-CFG-0138",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which machine is equivalent to PDA?",
  options: ["CFG", "DFA", "TM", "LBA"],
  answer: "CFG",
  explanation: "Pushdown automata recognize context-free languages, making them equivalent to Context-Free Grammars.",
},
{
  id: "TOC-FA-0139",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is closure property of regular languages?",
  options: ["Union", "Concatenation", "Kleene star", "All"],
  answer: "All",
  explanation: "Regular languages are closed under union, concatenation, and Kleene star operations.",
},
{
  id: "TOC-FA-0140",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which automaton has no memory?",
  options: ["PDA", "TM", "DFA", "LBA"],
  answer: "DFA",
  explanation: "A Deterministic Finite Automaton has no auxiliary memory or stack beyond its states.",
},
{
  id: "TOC-TUR-0141",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which is NOT part of 7-tuple of TM?",
  options: ["States", "Input alphabet", "Stack", "Tape alphabet"],
  answer: "Stack",
  explanation: "A Turing machine uses a tape and tape alphabet, whereas a stack belongs to a PDA.",
},
{
  id: "TOC-CFG-0142",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which language is context-sensitive?",
  options: ["a^n b^n", "a^n b^n c^n", "a*b*", "(ab)*"],
  answer: "a^n b^n c^n",
  explanation: "The language a^n b^n c^n is a classic example of a context-sensitive language.",
},
{
  id: "TOC-DEC-0143",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which is NOT decidable?",
  options: ["DFA emptiness", "DFA equivalence", "TM halting", "Regular membership"],
  answer: "TM halting",
  explanation: "The Turing machine halting problem is famously undecidable.",
},
{
  id: "TOC-FA-0144",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which of the following is deterministic?",
  options: ["NFA", "PDA", "DPDA", "Turing Machine"],
  answer: "DPDA",
  explanation: "DPDA stands for Deterministic Pushdown Automaton.",
},
{
  id: "TOC-FA-0145",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is NOT regular?",
  options: ["a*", "(ab)*", "a^n b^n", "(a+b)*"],
  answer: "a^n b^n",
  explanation: "The language a^n b^n requires memory to match counts, making it non-regular.",
},
{
  id: "TOC-TUR-0146",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which machine accepts recursively enumerable languages?",
  options: ["DFA", "PDA", "Turing Machine", "LBA"],
  answer: "Turing Machine",
  explanation: "Turing machines recognize the class of recursively enumerable languages.",
},
{
  id: "TOC-CFG-0147",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which grammar generates context-free languages?",
  options: ["Type-0", "Type-1", "Type-2", "Type-3"],
  answer: "Type-2",
  explanation: "Chomsky Type-2 grammars correspond to context-free languages.",
},
{
  id: "TOC-CFG-0148",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which closure property is true for CFL?",
  options: ["Union", "Intersection", "Complement", "All"],
  answer: "Union",
  explanation: "Context-free languages are closed under union, but not under intersection or complementation.",
},
{
  id: "TOC-FA-0149",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is true about NFA and DFA?",
  options: ["NFA more powerful", "Same power", "DFA more powerful", "None"],
  answer: "Same power",
  explanation: "NFA and DFA recognize the exact same class of languages (regular languages).",
},
{
  id: "TOC-TUR-0150",
  subject: "Theory of Computation",
  subtopic: "Turing Machines",
  question: "Which automaton uses infinite tape?",
  options: ["DFA", "PDA", "Turing Machine", "LBA"],
  answer: "Turing Machine",
  explanation: "A Turing machine uses an infinite tape for read and write operations.",
},
{
  id: "TOC-DEC-0151",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which problem is decidable?",
  options: ["Halting problem", "PDA equivalence", "DFA equivalence", "TM equivalence"],
  answer: "DFA equivalence",
  explanation: "Equivalence between two DFAs is a decidable problem.",
},
{
  id: "TOC-CFG-0152",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which class of languages is accepted by PDA?",
  options: ["Regular", "Context-free", "Context-sensitive", "Recursive"],
  answer: "Context-free",
  explanation: "Pushdown automata accept context-free languages.",
},
{
  id: "TOC-FA-0153",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is NOT a deterministic machine?",
  options: ["DFA", "DPDA", "NFA", "All deterministic"],
  answer: "NFA",
  explanation: "NFA stands for Nondeterministic Finite Automaton.",
},
{
  id: "TOC-DEC-0154",
  subject: "Theory of Computation",
  subtopic: "Decidability & Undecidability",
  question: "Which of the following is undecidable?",
  options: ["DFA emptiness", "PDA emptiness", "Halting problem", "Regular language membership"],
  answer: "Halting problem",
  explanation: "The halting problem cannot be solved by any Turing machine, making it undecidable.",
},
{
  id: "TOC-FA-0155",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which grammar corresponds to regular languages?",
  options: ["Type-0", "Type-1", "Type-2", "Type-3"],
  answer: "Type-3",
  explanation: "Chomsky Type-3 grammars generate regular languages.",
},
{
  id: "TOC-FA-0156",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which operation is NOT closed for regular languages?",
  options: ["Union", "Intersection", "Complement", "None of these"],
  answer: "None of these",
  explanation: "Regular languages are closed under union, intersection, and complement.",
},
{
  id: "TOC-FA-0157",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which is more powerful?",
  options: ["DFA", "NFA", "Both equal", "Turing Machine"],
  answer: "Turing Machine",
  explanation: "Turing machines can recognize recursively enumerable languages, which are far more powerful than regular languages recognized by DFAs or NFAs.",
},
{
  id: "TOC-CFG-0158",
  subject: "Theory of Computation",
  subtopic: "Context-Free Grammars & PDA",
  question: "Which of the following machines has a stack as memory?",
  options: ["Finite Automaton", "Turing Machine", "Pushdown Automaton", "Linear Bounded Automaton"],
  answer: "Pushdown Automaton",
  explanation: "A pushdown automaton is a finite automaton equipped with a stack.",
},
{
  id: "TOC-FA-0159",
  subject: "Theory of Computation",
  subtopic: "Finite Automata & Regular Languages",
  question: "Which language class is recognized by a DFA?",
  options: ["Regular", "Context-free", "Context-sensitive", "Recursively enumerable"],
  answer: "Regular",
  explanation: "Deterministic Finite Automata recognize the class of regular languages.",
}




]);

// === AUTO-GENERATED UNIQUE PREFIXES ===
// TOC-FA-
// TOC-CFL-
// TOC-CFG-
// TOC-DECID-
// TOC-TUR-
// TOC-COMPL-
// TOC-TURIN-
// TOC-CSG-
// TOC-DEC-
