var ans_box = document.getElementsByClassName("answer-box");
var submit_btn = document.getElementById("submit-btn");
var ques_con = document.getElementById("ques-con");
var question_title_box = document.getElementsByClassName("question")[0];
var ans_area = document.getElementsByClassName("answer-area")[0];
var index_box = document.getElementById("right-index");
var q_count_box = document.getElementById("index-count");
var ui = document.getElementsByClassName("app-ui")[0];
var time_box = document.getElementById("time-left");
var time_box1 = document.getElementById("time-left1");
var index = 0;
var r_ans_count = 0;

function questions() {
  let request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions_obj = JSON.parse(this.responseText);
      var q_count = questions_obj.length;
      q_count_box.innerHTML = q_count;
      create_elem_ques(questions_obj, index, q_count);
      create_elem_ans(questions_obj[index]);
      index_box.innerHTML = index + 1;
      chose_clicked_ans();
      countdown(2, 30, q_count, index);

      submit_btn.onclick = () => {
        check_answer(questions_obj, index);
        setTimeout(function () {
          if (index + 1 < q_count) {
            index++;
            index_box.innerHTML = index + 1;

            ques_con.removeChild(ques_con.firstElementChild);
            ans_area.removeChild(ans_area.firstElementChild);
            ans_area.removeChild(ans_area.firstElementChild);
            ans_area.removeChild(ans_area.firstElementChild);
            ans_area.removeChild(ans_area.firstElementChild);

            create_elem_ques(questions_obj, index, q_count);
            create_elem_ans(questions_obj[index]);

            chose_clicked_ans();
          } else {
            // check_answer(questions_obj, index);
            result(q_count);
          }
        }, 2000);
      };
    }
  };
  request.open("GET", "html_questions.json", true);
  request.send();
}
questions();

function create_elem_ques(q_obj, index, q_count) {
  if (index < q_count) {
    // question side
    var para = document.createElement("p");
    para.className = "question";
    para.innerHTML = q_obj[index].title;
    // append childs
    ques_con.appendChild(para);
  }
}

function create_elem_ans(q_obj) {
  for (var j = 1; j <= 4; j++) {
    // answer box div
    var ans_div = document.createElement("div");
    ans_div.className = "answer-box";
    // paragraph answer
    var ans_para = document.createElement("p");
    ans_para.innerHTML = q_obj[`answer_${j}`];
    // input
    var inp = document.createElement("input");
    inp.type = "radio";
    inp.name = "question";
    //append childs
    ans_div.appendChild(ans_para);
    ans_div.appendChild(inp);
    ans_area.appendChild(ans_div);
  }
}

function box_select(event) {
  var clicked_ans = event.currentTarget;
  clicked_ans.lastElementChild.checked = true;
}

function check_answer(q_obj, index) {
  for (var c = 0; c < 4; c++) {
    if (ans_box[c].lastElementChild.checked === true) {
      var chosen_btn = ans_box[c];
    }
    if (ans_box[c].firstElementChild.innerHTML === q_obj[index].right_answer) {
      var right_ans_color = ans_box[c];
    }
  }
  if (chosen_btn.firstElementChild.innerHTML === q_obj[index].right_answer) {
    status_color(chosen_btn, "right");
    r_ans_count++;
  } else {
    status_color(chosen_btn, "wrong");
    status_color(right_ans_color, "right");
  }
}

function chose_clicked_ans() {
  for (var i = 0; i < ans_box.length; i++) {
    var clicked1 = ans_box[i];
    clicked1.addEventListener("click", box_select);
  }
}
function result(q_count) {
  var para_res = document.createElement("p");
  para_res.className = "res";
  para_res.innerHTML = `you scored ${r_ans_count} of ${q_count}`;
  ui.innerHTML = "";
  ui.appendChild(para_res);
}
function status_color(ch, st) {
  var colored_div = document.createElement("div");
  colored_div.className = st;
  // ch.appendChild(colored_div);
  console.log(st)
  ch.classList.toggle(st);
}
function countdown(min, sec, count, index) {
  if (index < count) {
    countdownInterval = setInterval(function () {
      sec--;

      if (sec < 10) time_box1.innerHTML = `0${sec}`;
      else time_box1.innerHTML = sec;

      if (min < 10) time_box.innerHTML = `0${min}`;
      else time_box.innerHTML = min;

      if (sec == 0 && min != 0) {
        min--;
        sec = 60;
      }
      if (sec == 0 && min == 0) {
        clearInterval(countdown);
        result(count);
      }
    }, 1000);
  }
}

