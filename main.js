(() => {
  class Student {
    constructor(name, surname, patronName, faculty, yearEnroll, birthDate) {
      this.name = name;
      this.surname = surname;
      this.patronName = patronName;
      this.faculty = faculty;
      this.yearEnroll = yearEnroll;
      this.birthDate = new Date(birthDate);
    }
    get fullName() {
      return this.surname + ' ' + this.name + ' ' + this.patronName
    }
    get yearOfGrad() {
      return this.yearEnroll + 4;
    }
    get BirthDate() {
      const yyyy = this.birthDate.getFullYear();
      let mm = this.birthDate.getMonth() + 1;
      let dd = this.birthDate.getDate();
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      return dd + '.' + mm + '.' + yyyy;
    }

    get Age() {
      const today = new Date();
      let age = today.getFullYear() - this.birthDate.getFullYear();
      let m = today.getMonth() - this.birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
        age--;
      }
      return ` (${age} years)`;
    }
  }

  ///////////////           Default Array of students

  let students = [
    new Student('Harry', 'James', 'Potter', 'Gryffindor', 2003, (1980, 6, 31)),
    new Student('Draco', 'Lucius', 'Malfoy', 'Slytherin', 2014, (1980, 5, 5)),
    new Student('Hermione', 'Jean', 'Granger', 'Gryffindor', 2017, (1979, 8, 19)),
    new Student('Ronald', 'Bilius', 'Weasley', 'Gryffindor', 2020, (1980, 2, 1)),
    new Student('Luna', 'Elizabeth', 'Lovegood', 'Ravenclaw', 2021, (1981, 1, 13)),
  ]

  /////////////                   create new student function

  function newStudentTR(student) {
    const $studentTR = document.createElement('tr');
    const $fullNameTD = document.createElement('td');
    const $facultyTD = document.createElement('td');
    const $birthDateTD = document.createElement('td');
    const $enrollYearTD = document.createElement('td');
    const currentYear = new Date().getFullYear();
    const currentYearOfUniver = currentYear - student.yearEnroll;
    const nowMonth = parseInt(new Date().getMonth() + 1)

    $studentTR.setAttribute('name', student.name)
    $fullNameTD.textContent = student.fullName;
    $facultyTD.textContent = student.faculty;
    $birthDateTD.textContent = student.BirthDate + student.Age;

    //set textcontent as a real period of study which depends on current month
    if (currentYearOfUniver < 4) {
      if (currentYearOfUniver === 0 && nowMonth < 9) {  // if now is any month until september and student was enrolled current year
        $enrollYearTD.textContent = `${student.yearEnroll}-${student.yearOfGrad} (just enrolled at the university)`;
      }
      if (currentYearOfUniver === 0 && nowMonth >= 9) {  // if now is any month after september and student was enrolled current year
        $enrollYearTD.textContent = `${student.yearEnroll}-${student.yearOfGrad} (${currentYearOfUniver + 1} year of university)`;
      }
      if (currentYearOfUniver > 0 && nowMonth < 9) {  // if now is any month before september and student was enrolled last year or earlier
        $enrollYearTD.textContent = `${student.yearEnroll}-${student.yearOfGrad} (${currentYearOfUniver} year of university)`;
      }
      if (currentYearOfUniver > 0 && nowMonth >= 9) {  // if now is any month after september and student was enrolled last year or earlier
        $enrollYearTD.textContent = `${student.yearEnroll}-${student.yearOfGrad} (${currentYearOfUniver + 1} year of university)`;
      }
    } else $enrollYearTD.textContent = `${student.yearEnroll}-${student.yearOfGrad} (graduated)`;

    $studentTR.append($fullNameTD);
    $studentTR.append($facultyTD);
    $studentTR.append($birthDateTD);
    $studentTR.append($enrollYearTD);

    return $studentTR;
  }

  ///////////////                          add-student to array

  document.getElementById('add-student').addEventListener('submit', function (event) {
    event.preventDefault();
    // change first letter of name
    const nameStr = document.getElementById('inp-name').value;
    const finalName = nameStr.replace(nameStr.substring(0, 1), nameStr.substring(0, 1).toUpperCase());

    //change first letter of surname
    const surnameStr = document.getElementById('inp-surname').value;
    const finalSur = surnameStr.replace(surnameStr.substring(0, 1), surnameStr.substring(0, 1).toUpperCase());

    //change first letter of patronName
    const patronameStr = document.getElementById('inp-patronName').value;
    const finalPatron = patronameStr.replace(patronameStr.substring(0, 1), patronameStr.substring(0, 1).toUpperCase());

    // now we need to decide what contains array 'students'
    let localData = localStorage.getItem('studentsList');
    if (localData !== null && localData !== '') {
      students = JSON.parse(localData).map((studentData) => { // we get from LS the array of objects but we need to get the array of classes, so MAP hepls us
        const { name, surname, patronName, faculty, yearEnroll, birthDate } = studentData;
        return new Student(name, surname, patronName, faculty, yearEnroll, birthDate);
      })
    } else students = students;

    students.push(new Student(
      finalName,
      finalSur,
      finalPatron,
      document.getElementById('select-faculty').value,
      Number(document.getElementById('inp-yearEnroll').value),
      new Date(document.getElementById('inp-birthdate').value),
    ))
    saveList(students);
    document.forms[0].reset();
    render();
  })

  ///////////////                        sort studets by click

  function getSortStudents(prop, dir) {
    let localData = localStorage.getItem('studentsList'); // get data from localStorage
    let studentsCopy = null;

    if (localData !== null && localData !== '') {
      studentsCopy = JSON.parse(localData).map((studentData) => { // we get from LS the array of objects but we need to get the array of classes, so MAP hepls us
        const { name, surname, patronName, faculty, yearEnroll, birthDate } = studentData;
        return new Student(name, surname, patronName, faculty, yearEnroll, birthDate);
      })
    } else { // if LS is empty
      studentsCopy = [...students];
      saveList(studentsCopy);
    }
    return studentsCopy.sort((studentA, studentB) => {
      if ((!dir === false ? studentA[prop] < studentB[prop] : studentA[prop] > studentB[prop]))
        return -1;
    })
  }

  const $studentsListTHAll = document.querySelectorAll('.students-table th');
  let column = 'fullName'
  let colDir = true;

  $studentsListTHAll.forEach(elem => {  // by click change direction and reconstruck the table
    elem.addEventListener('click', function () {
      column = this.dataset.column;
      colDir = !colDir;
      render()
    })
  })

  ///////////////                  RENDER re-create a table with an added student

  const $studentsList = document.getElementById('students-list');

  function render() {
    let studentsCopy = getSortStudents(column, colDir);
    $studentsList.innerHTML = '';
    for (const student of studentsCopy) {
      $studentsList.append(newStudentTR(student))
    }
    let allTR = document.querySelectorAll('tr:not(.header)');
    allTR.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('clicked');
      })
    })
    saveList(studentsCopy)
    console.log('render/added', studentsCopy)
  }
  render();

  ///////////////              inputs validation

  const addInputs = document.querySelectorAll('.add-student input');
  addInputs.forEach((item) => item.required = 'true'); // all inputs are required

  document.querySelector('.add-student input[type="number"]').min = 2000; // set min limit for year of enrollment
  document.querySelector('.add-student input[type="number"]').max = new Date().getFullYear(); // set max limit for year of enrollment
  document.querySelector('.filter-student #year-enroll').min = 2000; // set min limit for year of enrollment for filters
  document.querySelector('.filter-student #year-grad').min = 2004; // set min limit for year of graduation for filters
  document.querySelector('.add-student input[type="date"]').min = '1900-01-01'; // set min limit for birthdate
  document.querySelector('.add-student input[type="date"]').max = new Date().toLocaleDateString('en-ca'); // set max limit for birthdate

  const textInputs = document.querySelectorAll('.add-student input[type="text"]'); // get all text inputs
  textInputs.forEach(item => {
    item.pattern = '^[a-zA-z]+$'; // checking input.value for latin letters/ white space/ numbers
  })

  ///////////////                    clear filters fields

  document.querySelector('.btn-clear').addEventListener('click', () => {
    document.forms[1].reset();
    render();
  })

  ///////////////                   delete any item from the table

  document.querySelector('.btn-delete').addEventListener('click', () => {
    let TRclicked = document.querySelectorAll('.clicked');
    let localData = localStorage.getItem('studentsList');
    // now we need to decide what contains array 'students'
    if (localData !== null && localData !== '') {
      students = JSON.parse(localData).map((studentData) => { // we get from LS the array of objects but we need to get the array of classes, so MAP hepls us
        const { name, surname, patronName, faculty, yearEnroll, birthDate } = studentData;
        return new Student(name, surname, patronName, faculty, yearEnroll, birthDate);
      })
    } else students = students;

    TRclicked.forEach(item => {
      let index = students.indexOf(students.find(elem => elem.name === item.getAttribute('name')));
      students.splice(index, 1);
      item.remove()
      saveList(students)
    })
    console.log('delete', students)
  })

  ///////////////                             filters

  let inpFilter = document.querySelectorAll('.inp-filter'); // get all filter-inputs
  inpFilter.forEach(item => item.addEventListener('input', fResultFilter));

  function fResultFilter() {
    const allTRs = [...document.querySelectorAll('tr:not(.header)')]; // get all rows
    const allSearch = [...document.querySelectorAll('.inp-filter')];  // get all filter-inputs as array

    // chain of filters
    allTRs.filter(function (el) {  // filter by full name
      if (el.children[0].textContent.search(new RegExp(`${allSearch[0].value}`, 'i')) < 0) {
        el.style.display = 'none';
        return false;
      } else return true

    }).filter(function (el) {  // filter by faculty / house
      if (el.children[1].textContent.search(new RegExp(`${allSearch[1].value}`, 'i')) < 0) {
        el.style.display = 'none';
        return false;
      } else return true

    }).filter(function (el) {  // filter by year of enrollment
      if (el.children[3].textContent.substring(0, 4).search(new RegExp(`${allSearch[2].value}`, 'i')) < 0) {
        el.style.display = 'none';
        return false;
      } else return true;

    }).filter(function (el) {  // filter by year of graduation
      if (el.children[3].textContent.substring(5, 9).search(new RegExp(`${allSearch[3].value}`, 'i')) < 0) {
        el.style.display = 'none';
        return false;
      } else {
        el.style.display = ''; // show only rows we need
        return true;
      }
    });
  }

  ///////////////                        local Storage Save

  function saveList(arr) {
    localStorage.setItem('studentsList', JSON.stringify(arr));
  }
})();
