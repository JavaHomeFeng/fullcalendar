
describe('visibleRange', function() {

	describe('when custom view with a flexible range', function() {
		pushOptions({
			defaultView: 'agenda'
		});

		describe('when given a valid date range', function() {
			var startInput = '2017-06-26';
			var endInput = '2017-06-29';

			describeOptions('visibleRange', {
				'of moment objects': {
					start: $.fullCalendar.moment(startInput),
					end: $.fullCalendar.moment(endInput)
				},
				'of strings': {
					start: startInput,
					end: endInput
				},
				'of a function that returns moment objects': function() {
					return {
						start: $.fullCalendar.moment(startInput),
						end: $.fullCalendar.moment(endInput)
					};
				},
				'of a function that returns strings': function() {
					return {
						start: startInput,
						end: endInput
					};
				},
			}, function() {
				it('gets set to the given range', function() {
					initCalendar();
					ViewDateUtils.expectVisibleRange(startInput, endInput);
				});
			});
		});

		describe('when a function', function() {
			it('receives the calendar\'s defaultDate', function() {
				var defaultDateInput = '2017-06-08T12:30:00';
				var matched = false;

				initCalendar({
					defaultDate: defaultDateInput,
					visibleRange: function(date) {
						// this function will receive the date for prev/next,
						// which should be ignored. make sure just one call matches.
						if (date.format() === defaultDateInput) {
							matched = true;
						}
					}
				});

				expect(matched).toBe(true);
			});
		});

		describe('when given an invalid range', function() {

			describeOptions('visibleRange', {
				'with end before start': {
					start: '2017-06-18',
					end: '2017-06-15'
				},
				'with no end': {
					start: '2017-06-18'
				},
				'with no start': {
					end: '2017-06-15'
				}
			}, function() {
				it('defaults to the defaultDate', function() { // TODO: have it report an warning
					initCalendar({
						defaultDate: '2017-08-01'
					})
					ViewDateUtils.expectVisibleRange('2017-08-01', '2017-08-02');
				});
			});
		});

		describe('when later switching to a one-day view', function() {

			it('constrains the current date to the start of visibleRange', function() {
				initCalendar({
					defaultDate: '2017-06-25',
					visibleRange: {
						start: '2017-06-26',
						end: '2017-06-29'
					}
				});
				currentCalendar.changeView('agendaDay');
				ViewDateUtils.expectVisibleRange('2017-06-26', '2017-06-27');
			});

			it('constrains the current date to the end of visibleRange', function() {
				initCalendar({
					defaultDate: '2017-07-01',
					visibleRange: {
						start: '2017-06-26',
						end: '2017-06-29'
					}
				});
				currentCalendar.changeView('agendaDay');
				ViewDateUtils.expectVisibleRange('2017-06-28', '2017-06-29');
			});
		});
	});

	describe('when custom view with fixed duration', function() {
		pushOptions({
			defaultDate: '2015-06-08',
			defaultView: 'agenda',
			duration: { days: 3 }
		});

		it('ignores the given visibleRange', function() {
			initCalendar({
				visibleRange: {
					start: '2017-06-29',
					end: '2017-07-04'
				}
			});
			ViewDateUtils.expectVisibleRange('2015-06-08', '2015-06-11');
		});
	});

	describe('when standard view', function() {
		pushOptions({
			defaultDate: '2015-06-08',
			defaultView: 'agendaWeek'
		});

		it('ignores the given visibleRange', function() {
			initCalendar({
				visibleRange: {
					start: '2017-06-29',
					end: '2017-07-04'
				}
			});
			ViewDateUtils.expectVisibleRange('2015-06-07', '2015-06-14');
		});
	});
});