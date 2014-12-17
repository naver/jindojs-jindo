QUnit.config.autostart = false;

module("$Form 객체", {
    setup: function() {
		frm = $Form($('form'));

		$('form').text.value = 'TEXT';
		$('form').textarea.value = 'TEXTAREA';
		$('form').password.value = 'PASSWORD';
		$('form').selectbox.selectedIndex = 1;
		$('form').radio[2].checked = true;
		$('form').checkbox.checked = false;
		frm.enable({
			"dup" : true,
			"radio" : true
		});
    }
});

	QUnit.test("serialize : 폼 항목들의 값을 queryString 으로 반환하는지",function(){

		equal(frm.serialize('text', 'textarea'), $H({
			text : 'TEXT',
			textarea : 'TEXTAREA'
		}).toQueryString());

		equal(frm.serialize(), $H({
			text : 'TEXT',
			textarea : 'TEXTAREA',
			dup : [ 'DUP1', 'DUP2', 'DUP3' ],
			password : 'PASSWORD',
			radio : 'R3',
			selectbox : 'S2'
		}).toQueryString());

	});

	QUnit.test("element : 원하는 폼 항목을 온전히 가져오는지",function(){

		equal(frm.element().length,frm._form.elements.length);
		equal(frm.element('text'),frm._form['text']);

		equal(frm.element('radio').length, frm._form.elements['radio'].length);
		equal(frm.element('radio').length, 3);

		equal(frm.element('dup').length, 3);

	});
	QUnit.test("element : 속성으로 접근할 때[[!	$Agent().navigator().ie]]",function(){

		deepEqual(frm.element('attributes'), undefined);

	});

	QUnit.test("enable : 원하는 폼 항목의 활성화 여부를 잘 다루는지 ",function(){

		frm.enable('textarea', false);
		ok(frm.element('textarea').disabled);
		ok(!frm.enable('textarea'));

		frm.enable('textarea', true);
		ok(!frm.element('textarea').disabled);
		ok(frm.enable('textarea'));

		frm.enable({
			'text' : false,
			'textarea' : true,
			'radio' : false,
			'dup' : false
		});
		ok(!frm.enable('text'));
		ok(frm.enable('textarea'));
		ok(!frm.enable('radio'));
		ok(!frm.enable('dup'));

		frm.enable('text', true);
		frm.enable('radio', true);
		frm.enable('dup', true);

		ok(frm.enable('text'));
		ok(frm.enable('radio'));
		ok(frm.enable('dup'));

	});

	QUnit.test("value : 원하는 폼 항목의 값을 잘 다루는지",function(){

		equal(frm.value('text'),'TEXT');
		equal(frm.value('text', 'TEXT2').value('text'),'TEXT2');

		equal(frm.value('textarea'),'TEXTAREA');
		equal(frm.value('textarea', 'TEXTAREA2').value('textarea'),'TEXTAREA2');

		frm.value('checkbox', 'CHECKBOX');
		equal(frm.value('checkbox'),'CHECKBOX');
		deepEqual(frm.value('checkbox', 'OTHER').value('checkbox'), undefined);

		equal(frm.value('radio'),'R3');
		equal(frm.value('selectbox'),'S2');

		frm.value({
			'radio' : 'OTHER',
			'selectbox' : 'S3'
		});

		deepEqual(frm.value('radio'), undefined);
		equal(frm.value('selectbox'),'S3');

		deepEqual(frm.value('selectbox', 'OTHER').value('selectbox'), undefined);

		// <option> 의 value 값이 없다면 text 값과 비교한다.
		equal(frm.value("selectbox", "S4").value("selectbox"),"S4");

	});
	QUnit.test("$value는 form을 반환해야한다.",function(){
		equal(frm.$value(),$('form'));
	});
	QUnit.test("reset은 form을 초기화해야한다.",function(){
		frm.reset();
		equal(frm.serialize(),"text=&textarea=&dup[]=DUP1&dup[]=DUP2&dup[]=DUP3&password=&selectbox=S1");
		frm.reset(function(frm){return frm.id == "form"});
		equal(frm.serialize(),"text=&textarea=&dup[]=DUP1&dup[]=DUP2&dup[]=DUP3&password=&selectbox=S1");
	});
	QUnit.test("value로 checkbox는 여러개가 선택되어야 한다.",function(){
		var eForm = $Form("checkbox_test");
		eForm.value("check_1",["1","2"]);
		deepEqual(eForm.value("check_1"),["1","2"]);
	});
	QUnit.test("select가 multiple일 경우 value로 여러개가 선택되어야 한다.",function(){
		var eForm = $Form("checkbox_test");
		eForm.value("choice",["1","2"]);
		deepEqual(eForm.value("choice"),["1","2"]);
	});
	QUnit.test("select가 multiple일 경우 value로 하나를 선택해도 정상적으로 선택되어야 한다.",function(){
		var eForm = $Form("checkbox_test");
		eForm.reset();
		eForm.value("choice","1");
		equal(eForm.value("choice"),["1"]);
	});
	QUnit.test("serialize는 checkbox가 여러개 선택되거나 selectbox가 multiple이 경우도 정상적로 동작해야한다.",function(){
		var eForm = $Form("checkbox_test");
		eForm.reset();
		eForm.value("check_1",["1","2"]);
		equal(eForm.serialize(),"check_1[]=1&check_1[]=2");

		eForm.reset();
		eForm.value("choice",["1","2"]);
		equal(eForm.serialize(),"choice[]=1&choice[]=2");
	});


module("$Form new API");
	QUnit.test("enable은 문자와 오브젝트 $H만 들어간다. ",function(){
		//Given
		var occurException = false;
		//When
		try{
			frm.enable(true);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.enable();
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.enable('textarea', true);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(!occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.enable({
				'text' : false,
				'textarea' : true,
				'radio' : false,
				'dup' : false
			});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(!occurException);


		//Given
		var occurException = false;
		//When
		try{
			frm.enable($H({
				'text' : false,
				'textarea' : true,
				'radio' : false,
				'dup' : false
			}));
		}catch(e){
			occurException = true;
		}
		//Then
		ok(!occurException);


	});
	QUnit.test("value은 문자와 오브젝트 $H만 들어간다. ",function(){
		//Given
		var occurException = false;
		//When
		try{
			frm.value(true);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.value();
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.value('radio');
		}catch(e){
			occurException = true;
		}
		//Then
		ok(!occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.value({
				'radio' : 'OTHER',
				'selectbox' : 'S3'
			});
		}catch(e){
			occurException = true;
		}
		//Then
		ok(!occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.value($H({
				'radio' : 'OTHER',
				'selectbox' : 'S3'
			}));
		}catch(e){
			occurException = true;
		}
		//Then
		ok(!occurException);

	});
	QUnit.test("submit의 인자가 하나인 경우 문자이거나 함수여야 한다.",function(){
		var submit_old = frm._form.submit;
		frm._form.submit = function(){};

		//Given
		var occurException = false;
		//When
		try{
			frm.submit(1);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

		//Given
		var occurException = false;
		//When
		try{
			frm.submit(1,1);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);
		frm._form.submit =  submit_old;
	});
	QUnit.test("reset의 인자는 함수여야 한다.",function(){

		//Given
		var occurException = false;
		//When
		try{
			frm.reset(1);
		}catch(e){
			occurException = true;
		}
		//Then
		ok(occurException);

	});
	QUnit.test("serialize함수는 disabled된 엘리먼트를 빼고 반환한다.",function(){
		//Given
		var form = $Form("disabledForm");
		//When
		var queryString = form.serialize();
		//Then
		equal(queryString,"disabledA=a");
	});
	QUnit.test("element의 반환 값은 배열이다.",function(){
		//Given
		var form = $Form("disabledForm");
		//When
		var aElement = form.element();
		//Then
		ok(jindo.$Jindo.isArray(aElement));
	});