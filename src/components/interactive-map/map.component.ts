/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: map.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 05/01/2017 1:59 PM
*/

import { Component, Pipe, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, animate, style, state, group, keyframes } from '@angular/core';

import { ACA_Animate } from '../../services/animate.service';
import { MapService } from '../../services';

declare let Hammer: any;

const ZOOM_LIMIT = 1000;
const FADE_TIME = 700;
const PADDING = 50;
/*
const zoom_anim = (function() {
let base = 50;
let space = 1;
let max = ZOOM_LIMIT;
let time = '50ms ease-in-out';
let animation: any[] = [];
// Create States
for(let i = base; i < max; i += space) {
//Width
let pos = i;
animation.push(`state('${i.toString()}',   style({'transform': 'scale(${pos/100})'}))`);
}
// Add transition
})();
//*/

@Component({
    selector: 'interactive-map',
    templateUrl: './map.template.html',
    styleUrls: [ './map.styles.css' ],
    animations: [
        trigger('zoom', [
            state('50',   style({'transform': 'translate(-50%, -50%) scale(0.5)'})),state('51',   style({'transform': 'translate(-50%, -50%) scale(0.51)'})),state('52',   style({'transform': 'translate(-50%, -50%) scale(0.52)'})),state('53',   style({'transform': 'translate(-50%, -50%) scale(0.53)'})),state('54',   style({'transform': 'translate(-50%, -50%) scale(0.54)'})),state('55',   style({'transform': 'translate(-50%, -50%) scale(0.55)'})),state('56',   style({'transform': 'translate(-50%, -50%) scale(0.56)'})),state('57',   style({'transform': 'translate(-50%, -50%) scale(0.57)'})),state('58',   style({'transform': 'translate(-50%, -50%) scale(0.58)'})),state('59',   style({'transform': 'translate(-50%, -50%) scale(0.59)'})),state('60',   style({'transform': 'translate(-50%, -50%) scale(0.6)'})),state('61',   style({'transform': 'translate(-50%, -50%) scale(0.61)'})),state('62',   style({'transform': 'translate(-50%, -50%) scale(0.62)'})),state('63',   style({'transform': 'translate(-50%, -50%) scale(0.63)'})),state('64',   style({'transform': 'translate(-50%, -50%) scale(0.64)'})),state('65',   style({'transform': 'translate(-50%, -50%) scale(0.65)'})),state('66',   style({'transform': 'translate(-50%, -50%) scale(0.66)'})),state('67',   style({'transform': 'translate(-50%, -50%) scale(0.67)'})),state('68',   style({'transform': 'translate(-50%, -50%) scale(0.68)'})),state('69',   style({'transform': 'translate(-50%, -50%) scale(0.69)'})),state('70',   style({'transform': 'translate(-50%, -50%) scale(0.7)'})),state('71',   style({'transform': 'translate(-50%, -50%) scale(0.71)'})),state('72',   style({'transform': 'translate(-50%, -50%) scale(0.72)'})),state('73',   style({'transform': 'translate(-50%, -50%) scale(0.73)'})),state('74',   style({'transform': 'translate(-50%, -50%) scale(0.74)'})),state('75',   style({'transform': 'translate(-50%, -50%) scale(0.75)'})),state('76',   style({'transform': 'translate(-50%, -50%) scale(0.76)'})),state('77',   style({'transform': 'translate(-50%, -50%) scale(0.77)'})),state('78',   style({'transform': 'translate(-50%, -50%) scale(0.78)'})),state('79',   style({'transform': 'translate(-50%, -50%) scale(0.79)'})),state('80',   style({'transform': 'translate(-50%, -50%) scale(0.8)'})),state('81',   style({'transform': 'translate(-50%, -50%) scale(0.81)'})),state('82',   style({'transform': 'translate(-50%, -50%) scale(0.82)'})),state('83',   style({'transform': 'translate(-50%, -50%) scale(0.83)'})),state('84',   style({'transform': 'translate(-50%, -50%) scale(0.84)'})),state('85',   style({'transform': 'translate(-50%, -50%) scale(0.85)'})),state('86',   style({'transform': 'translate(-50%, -50%) scale(0.86)'})),state('87',   style({'transform': 'translate(-50%, -50%) scale(0.87)'})),state('88',   style({'transform': 'translate(-50%, -50%) scale(0.88)'})),state('89',   style({'transform': 'translate(-50%, -50%) scale(0.89)'})),state('90',   style({'transform': 'translate(-50%, -50%) scale(0.9)'})),state('91',   style({'transform': 'translate(-50%, -50%) scale(0.91)'})),state('92',   style({'transform': 'translate(-50%, -50%) scale(0.92)'})),state('93',   style({'transform': 'translate(-50%, -50%) scale(0.93)'})),state('94',   style({'transform': 'translate(-50%, -50%) scale(0.94)'})),state('95',   style({'transform': 'translate(-50%, -50%) scale(0.95)'})),state('96',   style({'transform': 'translate(-50%, -50%) scale(0.96)'})),state('97',   style({'transform': 'translate(-50%, -50%) scale(0.97)'})),state('98',   style({'transform': 'translate(-50%, -50%) scale(0.98)'})),state('99',   style({'transform': 'translate(-50%, -50%) scale(0.99)'})),state('100',   style({'transform': 'translate(-50%, -50%) scale(1)'})),state('101',   style({'transform': 'translate(-50%, -50%) scale(1.01)'})),state('102',   style({'transform': 'translate(-50%, -50%) scale(1.02)'})),state('103',   style({'transform': 'translate(-50%, -50%) scale(1.03)'})),state('104',   style({'transform': 'translate(-50%, -50%) scale(1.04)'})),state('105',   style({'transform': 'translate(-50%, -50%) scale(1.05)'})),state('106',   style({'transform': 'translate(-50%, -50%) scale(1.06)'})),state('107',   style({'transform': 'translate(-50%, -50%) scale(1.07)'})),state('108',   style({'transform': 'translate(-50%, -50%) scale(1.08)'})),state('109',   style({'transform': 'translate(-50%, -50%) scale(1.09)'})),state('110',   style({'transform': 'translate(-50%, -50%) scale(1.1)'})),state('111',   style({'transform': 'translate(-50%, -50%) scale(1.11)'})),state('112',   style({'transform': 'translate(-50%, -50%) scale(1.12)'})),state('113',   style({'transform': 'translate(-50%, -50%) scale(1.13)'})),state('114',   style({'transform': 'translate(-50%, -50%) scale(1.14)'})),state('115',   style({'transform': 'translate(-50%, -50%) scale(1.15)'})),state('116',   style({'transform': 'translate(-50%, -50%) scale(1.16)'})),state('117',   style({'transform': 'translate(-50%, -50%) scale(1.17)'})),state('118',   style({'transform': 'translate(-50%, -50%) scale(1.18)'})),state('119',   style({'transform': 'translate(-50%, -50%) scale(1.19)'})),state('120',   style({'transform': 'translate(-50%, -50%) scale(1.2)'})),state('121',   style({'transform': 'translate(-50%, -50%) scale(1.21)'})),state('122',   style({'transform': 'translate(-50%, -50%) scale(1.22)'})),state('123',   style({'transform': 'translate(-50%, -50%) scale(1.23)'})),state('124',   style({'transform': 'translate(-50%, -50%) scale(1.24)'})),state('125',   style({'transform': 'translate(-50%, -50%) scale(1.25)'})),state('126',   style({'transform': 'translate(-50%, -50%) scale(1.26)'})),state('127',   style({'transform': 'translate(-50%, -50%) scale(1.27)'})),state('128',   style({'transform': 'translate(-50%, -50%) scale(1.28)'})),state('129',   style({'transform': 'translate(-50%, -50%) scale(1.29)'})),state('130',   style({'transform': 'translate(-50%, -50%) scale(1.3)'})),state('131',   style({'transform': 'translate(-50%, -50%) scale(1.31)'})),state('132',   style({'transform': 'translate(-50%, -50%) scale(1.32)'})),state('133',   style({'transform': 'translate(-50%, -50%) scale(1.33)'})),state('134',   style({'transform': 'translate(-50%, -50%) scale(1.34)'})),state('135',   style({'transform': 'translate(-50%, -50%) scale(1.35)'})),state('136',   style({'transform': 'translate(-50%, -50%) scale(1.36)'})),state('137',   style({'transform': 'translate(-50%, -50%) scale(1.37)'})),state('138',   style({'transform': 'translate(-50%, -50%) scale(1.38)'})),state('139',   style({'transform': 'translate(-50%, -50%) scale(1.39)'})),state('140',   style({'transform': 'translate(-50%, -50%) scale(1.4)'})),state('141',   style({'transform': 'translate(-50%, -50%) scale(1.41)'})),state('142',   style({'transform': 'translate(-50%, -50%) scale(1.42)'})),state('143',   style({'transform': 'translate(-50%, -50%) scale(1.43)'})),state('144',   style({'transform': 'translate(-50%, -50%) scale(1.44)'})),state('145',   style({'transform': 'translate(-50%, -50%) scale(1.45)'})),state('146',   style({'transform': 'translate(-50%, -50%) scale(1.46)'})),state('147',   style({'transform': 'translate(-50%, -50%) scale(1.47)'})),state('148',   style({'transform': 'translate(-50%, -50%) scale(1.48)'})),state('149',   style({'transform': 'translate(-50%, -50%) scale(1.49)'})),state('150',   style({'transform': 'translate(-50%, -50%) scale(1.5)'})),state('151',   style({'transform': 'translate(-50%, -50%) scale(1.51)'})),state('152',   style({'transform': 'translate(-50%, -50%) scale(1.52)'})),state('153',   style({'transform': 'translate(-50%, -50%) scale(1.53)'})),state('154',   style({'transform': 'translate(-50%, -50%) scale(1.54)'})),state('155',   style({'transform': 'translate(-50%, -50%) scale(1.55)'})),state('156',   style({'transform': 'translate(-50%, -50%) scale(1.56)'})),state('157',   style({'transform': 'translate(-50%, -50%) scale(1.57)'})),state('158',   style({'transform': 'translate(-50%, -50%) scale(1.58)'})),state('159',   style({'transform': 'translate(-50%, -50%) scale(1.59)'})),state('160',   style({'transform': 'translate(-50%, -50%) scale(1.6)'})),state('161',   style({'transform': 'translate(-50%, -50%) scale(1.61)'})),state('162',   style({'transform': 'translate(-50%, -50%) scale(1.62)'})),state('163',   style({'transform': 'translate(-50%, -50%) scale(1.63)'})),state('164',   style({'transform': 'translate(-50%, -50%) scale(1.64)'})),state('165',   style({'transform': 'translate(-50%, -50%) scale(1.65)'})),state('166',   style({'transform': 'translate(-50%, -50%) scale(1.66)'})),state('167',   style({'transform': 'translate(-50%, -50%) scale(1.67)'})),state('168',   style({'transform': 'translate(-50%, -50%) scale(1.68)'})),state('169',   style({'transform': 'translate(-50%, -50%) scale(1.69)'})),state('170',   style({'transform': 'translate(-50%, -50%) scale(1.7)'})),state('171',   style({'transform': 'translate(-50%, -50%) scale(1.71)'})),state('172',   style({'transform': 'translate(-50%, -50%) scale(1.72)'})),state('173',   style({'transform': 'translate(-50%, -50%) scale(1.73)'})),state('174',   style({'transform': 'translate(-50%, -50%) scale(1.74)'})),state('175',   style({'transform': 'translate(-50%, -50%) scale(1.75)'})),state('176',   style({'transform': 'translate(-50%, -50%) scale(1.76)'})),state('177',   style({'transform': 'translate(-50%, -50%) scale(1.77)'})),state('178',   style({'transform': 'translate(-50%, -50%) scale(1.78)'})),state('179',   style({'transform': 'translate(-50%, -50%) scale(1.79)'})),state('180',   style({'transform': 'translate(-50%, -50%) scale(1.8)'})),state('181',   style({'transform': 'translate(-50%, -50%) scale(1.81)'})),state('182',   style({'transform': 'translate(-50%, -50%) scale(1.82)'})),state('183',   style({'transform': 'translate(-50%, -50%) scale(1.83)'})),state('184',   style({'transform': 'translate(-50%, -50%) scale(1.84)'})),state('185',   style({'transform': 'translate(-50%, -50%) scale(1.85)'})),state('186',   style({'transform': 'translate(-50%, -50%) scale(1.86)'})),state('187',   style({'transform': 'translate(-50%, -50%) scale(1.87)'})),state('188',   style({'transform': 'translate(-50%, -50%) scale(1.88)'})),state('189',   style({'transform': 'translate(-50%, -50%) scale(1.89)'})),state('190',   style({'transform': 'translate(-50%, -50%) scale(1.9)'})),state('191',   style({'transform': 'translate(-50%, -50%) scale(1.91)'})),state('192',   style({'transform': 'translate(-50%, -50%) scale(1.92)'})),state('193',   style({'transform': 'translate(-50%, -50%) scale(1.93)'})),state('194',   style({'transform': 'translate(-50%, -50%) scale(1.94)'})),state('195',   style({'transform': 'translate(-50%, -50%) scale(1.95)'})),state('196',   style({'transform': 'translate(-50%, -50%) scale(1.96)'})),state('197',   style({'transform': 'translate(-50%, -50%) scale(1.97)'})),state('198',   style({'transform': 'translate(-50%, -50%) scale(1.98)'})),state('199',   style({'transform': 'translate(-50%, -50%) scale(1.99)'})),state('200',   style({'transform': 'translate(-50%, -50%) scale(2)'})),state('201',   style({'transform': 'translate(-50%, -50%) scale(2.01)'})),state('202',   style({'transform': 'translate(-50%, -50%) scale(2.02)'})),state('203',   style({'transform': 'translate(-50%, -50%) scale(2.03)'})),state('204',   style({'transform': 'translate(-50%, -50%) scale(2.04)'})),state('205',   style({'transform': 'translate(-50%, -50%) scale(2.05)'})),state('206',   style({'transform': 'translate(-50%, -50%) scale(2.06)'})),state('207',   style({'transform': 'translate(-50%, -50%) scale(2.07)'})),state('208',   style({'transform': 'translate(-50%, -50%) scale(2.08)'})),state('209',   style({'transform': 'translate(-50%, -50%) scale(2.09)'})),state('210',   style({'transform': 'translate(-50%, -50%) scale(2.1)'})),state('211',   style({'transform': 'translate(-50%, -50%) scale(2.11)'})),state('212',   style({'transform': 'translate(-50%, -50%) scale(2.12)'})),state('213',   style({'transform': 'translate(-50%, -50%) scale(2.13)'})),state('214',   style({'transform': 'translate(-50%, -50%) scale(2.14)'})),state('215',   style({'transform': 'translate(-50%, -50%) scale(2.15)'})),state('216',   style({'transform': 'translate(-50%, -50%) scale(2.16)'})),state('217',   style({'transform': 'translate(-50%, -50%) scale(2.17)'})),state('218',   style({'transform': 'translate(-50%, -50%) scale(2.18)'})),state('219',   style({'transform': 'translate(-50%, -50%) scale(2.19)'})),state('220',   style({'transform': 'translate(-50%, -50%) scale(2.2)'})),state('221',   style({'transform': 'translate(-50%, -50%) scale(2.21)'})),state('222',   style({'transform': 'translate(-50%, -50%) scale(2.22)'})),state('223',   style({'transform': 'translate(-50%, -50%) scale(2.23)'})),state('224',   style({'transform': 'translate(-50%, -50%) scale(2.24)'})),state('225',   style({'transform': 'translate(-50%, -50%) scale(2.25)'})),state('226',   style({'transform': 'translate(-50%, -50%) scale(2.26)'})),state('227',   style({'transform': 'translate(-50%, -50%) scale(2.27)'})),state('228',   style({'transform': 'translate(-50%, -50%) scale(2.28)'})),state('229',   style({'transform': 'translate(-50%, -50%) scale(2.29)'})),state('230',   style({'transform': 'translate(-50%, -50%) scale(2.3)'})),state('231',   style({'transform': 'translate(-50%, -50%) scale(2.31)'})),state('232',   style({'transform': 'translate(-50%, -50%) scale(2.32)'})),state('233',   style({'transform': 'translate(-50%, -50%) scale(2.33)'})),state('234',   style({'transform': 'translate(-50%, -50%) scale(2.34)'})),state('235',   style({'transform': 'translate(-50%, -50%) scale(2.35)'})),state('236',   style({'transform': 'translate(-50%, -50%) scale(2.36)'})),state('237',   style({'transform': 'translate(-50%, -50%) scale(2.37)'})),state('238',   style({'transform': 'translate(-50%, -50%) scale(2.38)'})),state('239',   style({'transform': 'translate(-50%, -50%) scale(2.39)'})),state('240',   style({'transform': 'translate(-50%, -50%) scale(2.4)'})),state('241',   style({'transform': 'translate(-50%, -50%) scale(2.41)'})),state('242',   style({'transform': 'translate(-50%, -50%) scale(2.42)'})),state('243',   style({'transform': 'translate(-50%, -50%) scale(2.43)'})),state('244',   style({'transform': 'translate(-50%, -50%) scale(2.44)'})),state('245',   style({'transform': 'translate(-50%, -50%) scale(2.45)'})),state('246',   style({'transform': 'translate(-50%, -50%) scale(2.46)'})),state('247',   style({'transform': 'translate(-50%, -50%) scale(2.47)'})),state('248',   style({'transform': 'translate(-50%, -50%) scale(2.48)'})),state('249',   style({'transform': 'translate(-50%, -50%) scale(2.49)'})),state('250',   style({'transform': 'translate(-50%, -50%) scale(2.5)'})),state('251',   style({'transform': 'translate(-50%, -50%) scale(2.51)'})),state('252',   style({'transform': 'translate(-50%, -50%) scale(2.52)'})),state('253',   style({'transform': 'translate(-50%, -50%) scale(2.53)'})),state('254',   style({'transform': 'translate(-50%, -50%) scale(2.54)'})),state('255',   style({'transform': 'translate(-50%, -50%) scale(2.55)'})),state('256',   style({'transform': 'translate(-50%, -50%) scale(2.56)'})),state('257',   style({'transform': 'translate(-50%, -50%) scale(2.57)'})),state('258',   style({'transform': 'translate(-50%, -50%) scale(2.58)'})),state('259',   style({'transform': 'translate(-50%, -50%) scale(2.59)'})),state('260',   style({'transform': 'translate(-50%, -50%) scale(2.6)'})),state('261',   style({'transform': 'translate(-50%, -50%) scale(2.61)'})),state('262',   style({'transform': 'translate(-50%, -50%) scale(2.62)'})),state('263',   style({'transform': 'translate(-50%, -50%) scale(2.63)'})),state('264',   style({'transform': 'translate(-50%, -50%) scale(2.64)'})),state('265',   style({'transform': 'translate(-50%, -50%) scale(2.65)'})),state('266',   style({'transform': 'translate(-50%, -50%) scale(2.66)'})),state('267',   style({'transform': 'translate(-50%, -50%) scale(2.67)'})),state('268',   style({'transform': 'translate(-50%, -50%) scale(2.68)'})),state('269',   style({'transform': 'translate(-50%, -50%) scale(2.69)'})),state('270',   style({'transform': 'translate(-50%, -50%) scale(2.7)'})),state('271',   style({'transform': 'translate(-50%, -50%) scale(2.71)'})),state('272',   style({'transform': 'translate(-50%, -50%) scale(2.72)'})),state('273',   style({'transform': 'translate(-50%, -50%) scale(2.73)'})),state('274',   style({'transform': 'translate(-50%, -50%) scale(2.74)'})),state('275',   style({'transform': 'translate(-50%, -50%) scale(2.75)'})),state('276',   style({'transform': 'translate(-50%, -50%) scale(2.76)'})),state('277',   style({'transform': 'translate(-50%, -50%) scale(2.77)'})),state('278',   style({'transform': 'translate(-50%, -50%) scale(2.78)'})),state('279',   style({'transform': 'translate(-50%, -50%) scale(2.79)'})),state('280',   style({'transform': 'translate(-50%, -50%) scale(2.8)'})),state('281',   style({'transform': 'translate(-50%, -50%) scale(2.81)'})),state('282',   style({'transform': 'translate(-50%, -50%) scale(2.82)'})),state('283',   style({'transform': 'translate(-50%, -50%) scale(2.83)'})),state('284',   style({'transform': 'translate(-50%, -50%) scale(2.84)'})),state('285',   style({'transform': 'translate(-50%, -50%) scale(2.85)'})),state('286',   style({'transform': 'translate(-50%, -50%) scale(2.86)'})),state('287',   style({'transform': 'translate(-50%, -50%) scale(2.87)'})),state('288',   style({'transform': 'translate(-50%, -50%) scale(2.88)'})),state('289',   style({'transform': 'translate(-50%, -50%) scale(2.89)'})),state('290',   style({'transform': 'translate(-50%, -50%) scale(2.9)'})),state('291',   style({'transform': 'translate(-50%, -50%) scale(2.91)'})),state('292',   style({'transform': 'translate(-50%, -50%) scale(2.92)'})),state('293',   style({'transform': 'translate(-50%, -50%) scale(2.93)'})),state('294',   style({'transform': 'translate(-50%, -50%) scale(2.94)'})),state('295',   style({'transform': 'translate(-50%, -50%) scale(2.95)'})),state('296',   style({'transform': 'translate(-50%, -50%) scale(2.96)'})),state('297',   style({'transform': 'translate(-50%, -50%) scale(2.97)'})),state('298',   style({'transform': 'translate(-50%, -50%) scale(2.98)'})),state('299',   style({'transform': 'translate(-50%, -50%) scale(2.99)'})),state('300',   style({'transform': 'translate(-50%, -50%) scale(3)'})),state('301',   style({'transform': 'translate(-50%, -50%) scale(3.01)'})),state('302',   style({'transform': 'translate(-50%, -50%) scale(3.02)'})),state('303',   style({'transform': 'translate(-50%, -50%) scale(3.03)'})),state('304',   style({'transform': 'translate(-50%, -50%) scale(3.04)'})),state('305',   style({'transform': 'translate(-50%, -50%) scale(3.05)'})),state('306',   style({'transform': 'translate(-50%, -50%) scale(3.06)'})),state('307',   style({'transform': 'translate(-50%, -50%) scale(3.07)'})),state('308',   style({'transform': 'translate(-50%, -50%) scale(3.08)'})),state('309',   style({'transform': 'translate(-50%, -50%) scale(3.09)'})),state('310',   style({'transform': 'translate(-50%, -50%) scale(3.1)'})),state('311',   style({'transform': 'translate(-50%, -50%) scale(3.11)'})),state('312',   style({'transform': 'translate(-50%, -50%) scale(3.12)'})),state('313',   style({'transform': 'translate(-50%, -50%) scale(3.13)'})),state('314',   style({'transform': 'translate(-50%, -50%) scale(3.14)'})),state('315',   style({'transform': 'translate(-50%, -50%) scale(3.15)'})),state('316',   style({'transform': 'translate(-50%, -50%) scale(3.16)'})),state('317',   style({'transform': 'translate(-50%, -50%) scale(3.17)'})),state('318',   style({'transform': 'translate(-50%, -50%) scale(3.18)'})),state('319',   style({'transform': 'translate(-50%, -50%) scale(3.19)'})),state('320',   style({'transform': 'translate(-50%, -50%) scale(3.2)'})),state('321',   style({'transform': 'translate(-50%, -50%) scale(3.21)'})),state('322',   style({'transform': 'translate(-50%, -50%) scale(3.22)'})),state('323',   style({'transform': 'translate(-50%, -50%) scale(3.23)'})),state('324',   style({'transform': 'translate(-50%, -50%) scale(3.24)'})),state('325',   style({'transform': 'translate(-50%, -50%) scale(3.25)'})),state('326',   style({'transform': 'translate(-50%, -50%) scale(3.26)'})),state('327',   style({'transform': 'translate(-50%, -50%) scale(3.27)'})),state('328',   style({'transform': 'translate(-50%, -50%) scale(3.28)'})),state('329',   style({'transform': 'translate(-50%, -50%) scale(3.29)'})),state('330',   style({'transform': 'translate(-50%, -50%) scale(3.3)'})),state('331',   style({'transform': 'translate(-50%, -50%) scale(3.31)'})),state('332',   style({'transform': 'translate(-50%, -50%) scale(3.32)'})),state('333',   style({'transform': 'translate(-50%, -50%) scale(3.33)'})),state('334',   style({'transform': 'translate(-50%, -50%) scale(3.34)'})),state('335',   style({'transform': 'translate(-50%, -50%) scale(3.35)'})),state('336',   style({'transform': 'translate(-50%, -50%) scale(3.36)'})),state('337',   style({'transform': 'translate(-50%, -50%) scale(3.37)'})),state('338',   style({'transform': 'translate(-50%, -50%) scale(3.38)'})),state('339',   style({'transform': 'translate(-50%, -50%) scale(3.39)'})),state('340',   style({'transform': 'translate(-50%, -50%) scale(3.4)'})),state('341',   style({'transform': 'translate(-50%, -50%) scale(3.41)'})),state('342',   style({'transform': 'translate(-50%, -50%) scale(3.42)'})),state('343',   style({'transform': 'translate(-50%, -50%) scale(3.43)'})),state('344',   style({'transform': 'translate(-50%, -50%) scale(3.44)'})),state('345',   style({'transform': 'translate(-50%, -50%) scale(3.45)'})),state('346',   style({'transform': 'translate(-50%, -50%) scale(3.46)'})),state('347',   style({'transform': 'translate(-50%, -50%) scale(3.47)'})),state('348',   style({'transform': 'translate(-50%, -50%) scale(3.48)'})),state('349',   style({'transform': 'translate(-50%, -50%) scale(3.49)'})),state('350',   style({'transform': 'translate(-50%, -50%) scale(3.5)'})),state('351',   style({'transform': 'translate(-50%, -50%) scale(3.51)'})),state('352',   style({'transform': 'translate(-50%, -50%) scale(3.52)'})),state('353',   style({'transform': 'translate(-50%, -50%) scale(3.53)'})),state('354',   style({'transform': 'translate(-50%, -50%) scale(3.54)'})),state('355',   style({'transform': 'translate(-50%, -50%) scale(3.55)'})),state('356',   style({'transform': 'translate(-50%, -50%) scale(3.56)'})),state('357',   style({'transform': 'translate(-50%, -50%) scale(3.57)'})),state('358',   style({'transform': 'translate(-50%, -50%) scale(3.58)'})),state('359',   style({'transform': 'translate(-50%, -50%) scale(3.59)'})),state('360',   style({'transform': 'translate(-50%, -50%) scale(3.6)'})),state('361',   style({'transform': 'translate(-50%, -50%) scale(3.61)'})),state('362',   style({'transform': 'translate(-50%, -50%) scale(3.62)'})),state('363',   style({'transform': 'translate(-50%, -50%) scale(3.63)'})),state('364',   style({'transform': 'translate(-50%, -50%) scale(3.64)'})),state('365',   style({'transform': 'translate(-50%, -50%) scale(3.65)'})),state('366',   style({'transform': 'translate(-50%, -50%) scale(3.66)'})),state('367',   style({'transform': 'translate(-50%, -50%) scale(3.67)'})),state('368',   style({'transform': 'translate(-50%, -50%) scale(3.68)'})),state('369',   style({'transform': 'translate(-50%, -50%) scale(3.69)'})),state('370',   style({'transform': 'translate(-50%, -50%) scale(3.7)'})),state('371',   style({'transform': 'translate(-50%, -50%) scale(3.71)'})),state('372',   style({'transform': 'translate(-50%, -50%) scale(3.72)'})),state('373',   style({'transform': 'translate(-50%, -50%) scale(3.73)'})),state('374',   style({'transform': 'translate(-50%, -50%) scale(3.74)'})),state('375',   style({'transform': 'translate(-50%, -50%) scale(3.75)'})),state('376',   style({'transform': 'translate(-50%, -50%) scale(3.76)'})),state('377',   style({'transform': 'translate(-50%, -50%) scale(3.77)'})),state('378',   style({'transform': 'translate(-50%, -50%) scale(3.78)'})),state('379',   style({'transform': 'translate(-50%, -50%) scale(3.79)'})),state('380',   style({'transform': 'translate(-50%, -50%) scale(3.8)'})),state('381',   style({'transform': 'translate(-50%, -50%) scale(3.81)'})),state('382',   style({'transform': 'translate(-50%, -50%) scale(3.82)'})),state('383',   style({'transform': 'translate(-50%, -50%) scale(3.83)'})),state('384',   style({'transform': 'translate(-50%, -50%) scale(3.84)'})),state('385',   style({'transform': 'translate(-50%, -50%) scale(3.85)'})),state('386',   style({'transform': 'translate(-50%, -50%) scale(3.86)'})),state('387',   style({'transform': 'translate(-50%, -50%) scale(3.87)'})),state('388',   style({'transform': 'translate(-50%, -50%) scale(3.88)'})),state('389',   style({'transform': 'translate(-50%, -50%) scale(3.89)'})),state('390',   style({'transform': 'translate(-50%, -50%) scale(3.9)'})),state('391',   style({'transform': 'translate(-50%, -50%) scale(3.91)'})),state('392',   style({'transform': 'translate(-50%, -50%) scale(3.92)'})),state('393',   style({'transform': 'translate(-50%, -50%) scale(3.93)'})),state('394',   style({'transform': 'translate(-50%, -50%) scale(3.94)'})),state('395',   style({'transform': 'translate(-50%, -50%) scale(3.95)'})),state('396',   style({'transform': 'translate(-50%, -50%) scale(3.96)'})),state('397',   style({'transform': 'translate(-50%, -50%) scale(3.97)'})),state('398',   style({'transform': 'translate(-50%, -50%) scale(3.98)'})),state('399',   style({'transform': 'translate(-50%, -50%) scale(3.99)'})),state('400',   style({'transform': 'translate(-50%, -50%) scale(4)'})),state('401',   style({'transform': 'translate(-50%, -50%) scale(4.01)'})),state('402',   style({'transform': 'translate(-50%, -50%) scale(4.02)'})),state('403',   style({'transform': 'translate(-50%, -50%) scale(4.03)'})),state('404',   style({'transform': 'translate(-50%, -50%) scale(4.04)'})),state('405',   style({'transform': 'translate(-50%, -50%) scale(4.05)'})),state('406',   style({'transform': 'translate(-50%, -50%) scale(4.06)'})),state('407',   style({'transform': 'translate(-50%, -50%) scale(4.07)'})),state('408',   style({'transform': 'translate(-50%, -50%) scale(4.08)'})),state('409',   style({'transform': 'translate(-50%, -50%) scale(4.09)'})),state('410',   style({'transform': 'translate(-50%, -50%) scale(4.1)'})),state('411',   style({'transform': 'translate(-50%, -50%) scale(4.11)'})),state('412',   style({'transform': 'translate(-50%, -50%) scale(4.12)'})),state('413',   style({'transform': 'translate(-50%, -50%) scale(4.13)'})),state('414',   style({'transform': 'translate(-50%, -50%) scale(4.14)'})),state('415',   style({'transform': 'translate(-50%, -50%) scale(4.15)'})),state('416',   style({'transform': 'translate(-50%, -50%) scale(4.16)'})),state('417',   style({'transform': 'translate(-50%, -50%) scale(4.17)'})),state('418',   style({'transform': 'translate(-50%, -50%) scale(4.18)'})),state('419',   style({'transform': 'translate(-50%, -50%) scale(4.19)'})),state('420',   style({'transform': 'translate(-50%, -50%) scale(4.2)'})),state('421',   style({'transform': 'translate(-50%, -50%) scale(4.21)'})),state('422',   style({'transform': 'translate(-50%, -50%) scale(4.22)'})),state('423',   style({'transform': 'translate(-50%, -50%) scale(4.23)'})),state('424',   style({'transform': 'translate(-50%, -50%) scale(4.24)'})),state('425',   style({'transform': 'translate(-50%, -50%) scale(4.25)'})),state('426',   style({'transform': 'translate(-50%, -50%) scale(4.26)'})),state('427',   style({'transform': 'translate(-50%, -50%) scale(4.27)'})),state('428',   style({'transform': 'translate(-50%, -50%) scale(4.28)'})),state('429',   style({'transform': 'translate(-50%, -50%) scale(4.29)'})),state('430',   style({'transform': 'translate(-50%, -50%) scale(4.3)'})),state('431',   style({'transform': 'translate(-50%, -50%) scale(4.31)'})),state('432',   style({'transform': 'translate(-50%, -50%) scale(4.32)'})),state('433',   style({'transform': 'translate(-50%, -50%) scale(4.33)'})),state('434',   style({'transform': 'translate(-50%, -50%) scale(4.34)'})),state('435',   style({'transform': 'translate(-50%, -50%) scale(4.35)'})),state('436',   style({'transform': 'translate(-50%, -50%) scale(4.36)'})),state('437',   style({'transform': 'translate(-50%, -50%) scale(4.37)'})),state('438',   style({'transform': 'translate(-50%, -50%) scale(4.38)'})),state('439',   style({'transform': 'translate(-50%, -50%) scale(4.39)'})),state('440',   style({'transform': 'translate(-50%, -50%) scale(4.4)'})),state('441',   style({'transform': 'translate(-50%, -50%) scale(4.41)'})),state('442',   style({'transform': 'translate(-50%, -50%) scale(4.42)'})),state('443',   style({'transform': 'translate(-50%, -50%) scale(4.43)'})),state('444',   style({'transform': 'translate(-50%, -50%) scale(4.44)'})),state('445',   style({'transform': 'translate(-50%, -50%) scale(4.45)'})),state('446',   style({'transform': 'translate(-50%, -50%) scale(4.46)'})),state('447',   style({'transform': 'translate(-50%, -50%) scale(4.47)'})),state('448',   style({'transform': 'translate(-50%, -50%) scale(4.48)'})),state('449',   style({'transform': 'translate(-50%, -50%) scale(4.49)'})),state('450',   style({'transform': 'translate(-50%, -50%) scale(4.5)'})),state('451',   style({'transform': 'translate(-50%, -50%) scale(4.51)'})),state('452',   style({'transform': 'translate(-50%, -50%) scale(4.52)'})),state('453',   style({'transform': 'translate(-50%, -50%) scale(4.53)'})),state('454',   style({'transform': 'translate(-50%, -50%) scale(4.54)'})),state('455',   style({'transform': 'translate(-50%, -50%) scale(4.55)'})),state('456',   style({'transform': 'translate(-50%, -50%) scale(4.56)'})),state('457',   style({'transform': 'translate(-50%, -50%) scale(4.57)'})),state('458',   style({'transform': 'translate(-50%, -50%) scale(4.58)'})),state('459',   style({'transform': 'translate(-50%, -50%) scale(4.59)'})),state('460',   style({'transform': 'translate(-50%, -50%) scale(4.6)'})),state('461',   style({'transform': 'translate(-50%, -50%) scale(4.61)'})),state('462',   style({'transform': 'translate(-50%, -50%) scale(4.62)'})),state('463',   style({'transform': 'translate(-50%, -50%) scale(4.63)'})),state('464',   style({'transform': 'translate(-50%, -50%) scale(4.64)'})),state('465',   style({'transform': 'translate(-50%, -50%) scale(4.65)'})),state('466',   style({'transform': 'translate(-50%, -50%) scale(4.66)'})),state('467',   style({'transform': 'translate(-50%, -50%) scale(4.67)'})),state('468',   style({'transform': 'translate(-50%, -50%) scale(4.68)'})),state('469',   style({'transform': 'translate(-50%, -50%) scale(4.69)'})),state('470',   style({'transform': 'translate(-50%, -50%) scale(4.7)'})),state('471',   style({'transform': 'translate(-50%, -50%) scale(4.71)'})),state('472',   style({'transform': 'translate(-50%, -50%) scale(4.72)'})),state('473',   style({'transform': 'translate(-50%, -50%) scale(4.73)'})),state('474',   style({'transform': 'translate(-50%, -50%) scale(4.74)'})),state('475',   style({'transform': 'translate(-50%, -50%) scale(4.75)'})),state('476',   style({'transform': 'translate(-50%, -50%) scale(4.76)'})),state('477',   style({'transform': 'translate(-50%, -50%) scale(4.77)'})),state('478',   style({'transform': 'translate(-50%, -50%) scale(4.78)'})),state('479',   style({'transform': 'translate(-50%, -50%) scale(4.79)'})),state('480',   style({'transform': 'translate(-50%, -50%) scale(4.8)'})),state('481',   style({'transform': 'translate(-50%, -50%) scale(4.81)'})),state('482',   style({'transform': 'translate(-50%, -50%) scale(4.82)'})),state('483',   style({'transform': 'translate(-50%, -50%) scale(4.83)'})),state('484',   style({'transform': 'translate(-50%, -50%) scale(4.84)'})),state('485',   style({'transform': 'translate(-50%, -50%) scale(4.85)'})),state('486',   style({'transform': 'translate(-50%, -50%) scale(4.86)'})),state('487',   style({'transform': 'translate(-50%, -50%) scale(4.87)'})),state('488',   style({'transform': 'translate(-50%, -50%) scale(4.88)'})),state('489',   style({'transform': 'translate(-50%, -50%) scale(4.89)'})),state('490',   style({'transform': 'translate(-50%, -50%) scale(4.9)'})),state('491',   style({'transform': 'translate(-50%, -50%) scale(4.91)'})),state('492',   style({'transform': 'translate(-50%, -50%) scale(4.92)'})),state('493',   style({'transform': 'translate(-50%, -50%) scale(4.93)'})),state('494',   style({'transform': 'translate(-50%, -50%) scale(4.94)'})),state('495',   style({'transform': 'translate(-50%, -50%) scale(4.95)'})),state('496',   style({'transform': 'translate(-50%, -50%) scale(4.96)'})),state('497',   style({'transform': 'translate(-50%, -50%) scale(4.97)'})),state('498',   style({'transform': 'translate(-50%, -50%) scale(4.98)'})),state('499',   style({'transform': 'translate(-50%, -50%) scale(4.99)'})),state('500',   style({'transform': 'translate(-50%, -50%) scale(5)'})),state('501',   style({'transform': 'translate(-50%, -50%) scale(5.01)'})),state('502',   style({'transform': 'translate(-50%, -50%) scale(5.02)'})),state('503',   style({'transform': 'translate(-50%, -50%) scale(5.03)'})),state('504',   style({'transform': 'translate(-50%, -50%) scale(5.04)'})),state('505',   style({'transform': 'translate(-50%, -50%) scale(5.05)'})),state('506',   style({'transform': 'translate(-50%, -50%) scale(5.06)'})),state('507',   style({'transform': 'translate(-50%, -50%) scale(5.07)'})),state('508',   style({'transform': 'translate(-50%, -50%) scale(5.08)'})),state('509',   style({'transform': 'translate(-50%, -50%) scale(5.09)'})),state('510',   style({'transform': 'translate(-50%, -50%) scale(5.1)'})),state('511',   style({'transform': 'translate(-50%, -50%) scale(5.11)'})),state('512',   style({'transform': 'translate(-50%, -50%) scale(5.12)'})),state('513',   style({'transform': 'translate(-50%, -50%) scale(5.13)'})),state('514',   style({'transform': 'translate(-50%, -50%) scale(5.14)'})),state('515',   style({'transform': 'translate(-50%, -50%) scale(5.15)'})),state('516',   style({'transform': 'translate(-50%, -50%) scale(5.16)'})),state('517',   style({'transform': 'translate(-50%, -50%) scale(5.17)'})),state('518',   style({'transform': 'translate(-50%, -50%) scale(5.18)'})),state('519',   style({'transform': 'translate(-50%, -50%) scale(5.19)'})),state('520',   style({'transform': 'translate(-50%, -50%) scale(5.2)'})),state('521',   style({'transform': 'translate(-50%, -50%) scale(5.21)'})),state('522',   style({'transform': 'translate(-50%, -50%) scale(5.22)'})),state('523',   style({'transform': 'translate(-50%, -50%) scale(5.23)'})),state('524',   style({'transform': 'translate(-50%, -50%) scale(5.24)'})),state('525',   style({'transform': 'translate(-50%, -50%) scale(5.25)'})),state('526',   style({'transform': 'translate(-50%, -50%) scale(5.26)'})),state('527',   style({'transform': 'translate(-50%, -50%) scale(5.27)'})),state('528',   style({'transform': 'translate(-50%, -50%) scale(5.28)'})),state('529',   style({'transform': 'translate(-50%, -50%) scale(5.29)'})),state('530',   style({'transform': 'translate(-50%, -50%) scale(5.3)'})),state('531',   style({'transform': 'translate(-50%, -50%) scale(5.31)'})),state('532',   style({'transform': 'translate(-50%, -50%) scale(5.32)'})),state('533',   style({'transform': 'translate(-50%, -50%) scale(5.33)'})),state('534',   style({'transform': 'translate(-50%, -50%) scale(5.34)'})),state('535',   style({'transform': 'translate(-50%, -50%) scale(5.35)'})),state('536',   style({'transform': 'translate(-50%, -50%) scale(5.36)'})),state('537',   style({'transform': 'translate(-50%, -50%) scale(5.37)'})),state('538',   style({'transform': 'translate(-50%, -50%) scale(5.38)'})),state('539',   style({'transform': 'translate(-50%, -50%) scale(5.39)'})),state('540',   style({'transform': 'translate(-50%, -50%) scale(5.4)'})),state('541',   style({'transform': 'translate(-50%, -50%) scale(5.41)'})),state('542',   style({'transform': 'translate(-50%, -50%) scale(5.42)'})),state('543',   style({'transform': 'translate(-50%, -50%) scale(5.43)'})),state('544',   style({'transform': 'translate(-50%, -50%) scale(5.44)'})),state('545',   style({'transform': 'translate(-50%, -50%) scale(5.45)'})),state('546',   style({'transform': 'translate(-50%, -50%) scale(5.46)'})),state('547',   style({'transform': 'translate(-50%, -50%) scale(5.47)'})),state('548',   style({'transform': 'translate(-50%, -50%) scale(5.48)'})),state('549',   style({'transform': 'translate(-50%, -50%) scale(5.49)'})),state('550',   style({'transform': 'translate(-50%, -50%) scale(5.5)'})),state('551',   style({'transform': 'translate(-50%, -50%) scale(5.51)'})),state('552',   style({'transform': 'translate(-50%, -50%) scale(5.52)'})),state('553',   style({'transform': 'translate(-50%, -50%) scale(5.53)'})),state('554',   style({'transform': 'translate(-50%, -50%) scale(5.54)'})),state('555',   style({'transform': 'translate(-50%, -50%) scale(5.55)'})),state('556',   style({'transform': 'translate(-50%, -50%) scale(5.56)'})),state('557',   style({'transform': 'translate(-50%, -50%) scale(5.57)'})),state('558',   style({'transform': 'translate(-50%, -50%) scale(5.58)'})),state('559',   style({'transform': 'translate(-50%, -50%) scale(5.59)'})),state('560',   style({'transform': 'translate(-50%, -50%) scale(5.6)'})),state('561',   style({'transform': 'translate(-50%, -50%) scale(5.61)'})),state('562',   style({'transform': 'translate(-50%, -50%) scale(5.62)'})),state('563',   style({'transform': 'translate(-50%, -50%) scale(5.63)'})),state('564',   style({'transform': 'translate(-50%, -50%) scale(5.64)'})),state('565',   style({'transform': 'translate(-50%, -50%) scale(5.65)'})),state('566',   style({'transform': 'translate(-50%, -50%) scale(5.66)'})),state('567',   style({'transform': 'translate(-50%, -50%) scale(5.67)'})),state('568',   style({'transform': 'translate(-50%, -50%) scale(5.68)'})),state('569',   style({'transform': 'translate(-50%, -50%) scale(5.69)'})),state('570',   style({'transform': 'translate(-50%, -50%) scale(5.7)'})),state('571',   style({'transform': 'translate(-50%, -50%) scale(5.71)'})),state('572',   style({'transform': 'translate(-50%, -50%) scale(5.72)'})),state('573',   style({'transform': 'translate(-50%, -50%) scale(5.73)'})),state('574',   style({'transform': 'translate(-50%, -50%) scale(5.74)'})),state('575',   style({'transform': 'translate(-50%, -50%) scale(5.75)'})),state('576',   style({'transform': 'translate(-50%, -50%) scale(5.76)'})),state('577',   style({'transform': 'translate(-50%, -50%) scale(5.77)'})),state('578',   style({'transform': 'translate(-50%, -50%) scale(5.78)'})),state('579',   style({'transform': 'translate(-50%, -50%) scale(5.79)'})),state('580',   style({'transform': 'translate(-50%, -50%) scale(5.8)'})),state('581',   style({'transform': 'translate(-50%, -50%) scale(5.81)'})),state('582',   style({'transform': 'translate(-50%, -50%) scale(5.82)'})),state('583',   style({'transform': 'translate(-50%, -50%) scale(5.83)'})),state('584',   style({'transform': 'translate(-50%, -50%) scale(5.84)'})),state('585',   style({'transform': 'translate(-50%, -50%) scale(5.85)'})),state('586',   style({'transform': 'translate(-50%, -50%) scale(5.86)'})),state('587',   style({'transform': 'translate(-50%, -50%) scale(5.87)'})),state('588',   style({'transform': 'translate(-50%, -50%) scale(5.88)'})),state('589',   style({'transform': 'translate(-50%, -50%) scale(5.89)'})),state('590',   style({'transform': 'translate(-50%, -50%) scale(5.9)'})),state('591',   style({'transform': 'translate(-50%, -50%) scale(5.91)'})),state('592',   style({'transform': 'translate(-50%, -50%) scale(5.92)'})),state('593',   style({'transform': 'translate(-50%, -50%) scale(5.93)'})),state('594',   style({'transform': 'translate(-50%, -50%) scale(5.94)'})),state('595',   style({'transform': 'translate(-50%, -50%) scale(5.95)'})),state('596',   style({'transform': 'translate(-50%, -50%) scale(5.96)'})),state('597',   style({'transform': 'translate(-50%, -50%) scale(5.97)'})),state('598',   style({'transform': 'translate(-50%, -50%) scale(5.98)'})),state('599',   style({'transform': 'translate(-50%, -50%) scale(5.99)'})),state('600',   style({'transform': 'translate(-50%, -50%) scale(6)'})),state('601',   style({'transform': 'translate(-50%, -50%) scale(6.01)'})),state('602',   style({'transform': 'translate(-50%, -50%) scale(6.02)'})),state('603',   style({'transform': 'translate(-50%, -50%) scale(6.03)'})),state('604',   style({'transform': 'translate(-50%, -50%) scale(6.04)'})),state('605',   style({'transform': 'translate(-50%, -50%) scale(6.05)'})),state('606',   style({'transform': 'translate(-50%, -50%) scale(6.06)'})),state('607',   style({'transform': 'translate(-50%, -50%) scale(6.07)'})),state('608',   style({'transform': 'translate(-50%, -50%) scale(6.08)'})),state('609',   style({'transform': 'translate(-50%, -50%) scale(6.09)'})),state('610',   style({'transform': 'translate(-50%, -50%) scale(6.1)'})),state('611',   style({'transform': 'translate(-50%, -50%) scale(6.11)'})),state('612',   style({'transform': 'translate(-50%, -50%) scale(6.12)'})),state('613',   style({'transform': 'translate(-50%, -50%) scale(6.13)'})),state('614',   style({'transform': 'translate(-50%, -50%) scale(6.14)'})),state('615',   style({'transform': 'translate(-50%, -50%) scale(6.15)'})),state('616',   style({'transform': 'translate(-50%, -50%) scale(6.16)'})),state('617',   style({'transform': 'translate(-50%, -50%) scale(6.17)'})),state('618',   style({'transform': 'translate(-50%, -50%) scale(6.18)'})),state('619',   style({'transform': 'translate(-50%, -50%) scale(6.19)'})),state('620',   style({'transform': 'translate(-50%, -50%) scale(6.2)'})),state('621',   style({'transform': 'translate(-50%, -50%) scale(6.21)'})),state('622',   style({'transform': 'translate(-50%, -50%) scale(6.22)'})),state('623',   style({'transform': 'translate(-50%, -50%) scale(6.23)'})),state('624',   style({'transform': 'translate(-50%, -50%) scale(6.24)'})),state('625',   style({'transform': 'translate(-50%, -50%) scale(6.25)'})),state('626',   style({'transform': 'translate(-50%, -50%) scale(6.26)'})),state('627',   style({'transform': 'translate(-50%, -50%) scale(6.27)'})),state('628',   style({'transform': 'translate(-50%, -50%) scale(6.28)'})),state('629',   style({'transform': 'translate(-50%, -50%) scale(6.29)'})),state('630',   style({'transform': 'translate(-50%, -50%) scale(6.3)'})),state('631',   style({'transform': 'translate(-50%, -50%) scale(6.31)'})),state('632',   style({'transform': 'translate(-50%, -50%) scale(6.32)'})),state('633',   style({'transform': 'translate(-50%, -50%) scale(6.33)'})),state('634',   style({'transform': 'translate(-50%, -50%) scale(6.34)'})),state('635',   style({'transform': 'translate(-50%, -50%) scale(6.35)'})),state('636',   style({'transform': 'translate(-50%, -50%) scale(6.36)'})),state('637',   style({'transform': 'translate(-50%, -50%) scale(6.37)'})),state('638',   style({'transform': 'translate(-50%, -50%) scale(6.38)'})),state('639',   style({'transform': 'translate(-50%, -50%) scale(6.39)'})),state('640',   style({'transform': 'translate(-50%, -50%) scale(6.4)'})),state('641',   style({'transform': 'translate(-50%, -50%) scale(6.41)'})),state('642',   style({'transform': 'translate(-50%, -50%) scale(6.42)'})),state('643',   style({'transform': 'translate(-50%, -50%) scale(6.43)'})),state('644',   style({'transform': 'translate(-50%, -50%) scale(6.44)'})),state('645',   style({'transform': 'translate(-50%, -50%) scale(6.45)'})),state('646',   style({'transform': 'translate(-50%, -50%) scale(6.46)'})),state('647',   style({'transform': 'translate(-50%, -50%) scale(6.47)'})),state('648',   style({'transform': 'translate(-50%, -50%) scale(6.48)'})),state('649',   style({'transform': 'translate(-50%, -50%) scale(6.49)'})),state('650',   style({'transform': 'translate(-50%, -50%) scale(6.5)'})),state('651',   style({'transform': 'translate(-50%, -50%) scale(6.51)'})),state('652',   style({'transform': 'translate(-50%, -50%) scale(6.52)'})),state('653',   style({'transform': 'translate(-50%, -50%) scale(6.53)'})),state('654',   style({'transform': 'translate(-50%, -50%) scale(6.54)'})),state('655',   style({'transform': 'translate(-50%, -50%) scale(6.55)'})),state('656',   style({'transform': 'translate(-50%, -50%) scale(6.56)'})),state('657',   style({'transform': 'translate(-50%, -50%) scale(6.57)'})),state('658',   style({'transform': 'translate(-50%, -50%) scale(6.58)'})),state('659',   style({'transform': 'translate(-50%, -50%) scale(6.59)'})),state('660',   style({'transform': 'translate(-50%, -50%) scale(6.6)'})),state('661',   style({'transform': 'translate(-50%, -50%) scale(6.61)'})),state('662',   style({'transform': 'translate(-50%, -50%) scale(6.62)'})),state('663',   style({'transform': 'translate(-50%, -50%) scale(6.63)'})),state('664',   style({'transform': 'translate(-50%, -50%) scale(6.64)'})),state('665',   style({'transform': 'translate(-50%, -50%) scale(6.65)'})),state('666',   style({'transform': 'translate(-50%, -50%) scale(6.66)'})),state('667',   style({'transform': 'translate(-50%, -50%) scale(6.67)'})),state('668',   style({'transform': 'translate(-50%, -50%) scale(6.68)'})),state('669',   style({'transform': 'translate(-50%, -50%) scale(6.69)'})),state('670',   style({'transform': 'translate(-50%, -50%) scale(6.7)'})),state('671',   style({'transform': 'translate(-50%, -50%) scale(6.71)'})),state('672',   style({'transform': 'translate(-50%, -50%) scale(6.72)'})),state('673',   style({'transform': 'translate(-50%, -50%) scale(6.73)'})),state('674',   style({'transform': 'translate(-50%, -50%) scale(6.74)'})),state('675',   style({'transform': 'translate(-50%, -50%) scale(6.75)'})),state('676',   style({'transform': 'translate(-50%, -50%) scale(6.76)'})),state('677',   style({'transform': 'translate(-50%, -50%) scale(6.77)'})),state('678',   style({'transform': 'translate(-50%, -50%) scale(6.78)'})),state('679',   style({'transform': 'translate(-50%, -50%) scale(6.79)'})),state('680',   style({'transform': 'translate(-50%, -50%) scale(6.8)'})),state('681',   style({'transform': 'translate(-50%, -50%) scale(6.81)'})),state('682',   style({'transform': 'translate(-50%, -50%) scale(6.82)'})),state('683',   style({'transform': 'translate(-50%, -50%) scale(6.83)'})),state('684',   style({'transform': 'translate(-50%, -50%) scale(6.84)'})),state('685',   style({'transform': 'translate(-50%, -50%) scale(6.85)'})),state('686',   style({'transform': 'translate(-50%, -50%) scale(6.86)'})),state('687',   style({'transform': 'translate(-50%, -50%) scale(6.87)'})),state('688',   style({'transform': 'translate(-50%, -50%) scale(6.88)'})),state('689',   style({'transform': 'translate(-50%, -50%) scale(6.89)'})),state('690',   style({'transform': 'translate(-50%, -50%) scale(6.9)'})),state('691',   style({'transform': 'translate(-50%, -50%) scale(6.91)'})),state('692',   style({'transform': 'translate(-50%, -50%) scale(6.92)'})),state('693',   style({'transform': 'translate(-50%, -50%) scale(6.93)'})),state('694',   style({'transform': 'translate(-50%, -50%) scale(6.94)'})),state('695',   style({'transform': 'translate(-50%, -50%) scale(6.95)'})),state('696',   style({'transform': 'translate(-50%, -50%) scale(6.96)'})),state('697',   style({'transform': 'translate(-50%, -50%) scale(6.97)'})),state('698',   style({'transform': 'translate(-50%, -50%) scale(6.98)'})),state('699',   style({'transform': 'translate(-50%, -50%) scale(6.99)'})),state('700',   style({'transform': 'translate(-50%, -50%) scale(7)'})),state('701',   style({'transform': 'translate(-50%, -50%) scale(7.01)'})),state('702',   style({'transform': 'translate(-50%, -50%) scale(7.02)'})),state('703',   style({'transform': 'translate(-50%, -50%) scale(7.03)'})),state('704',   style({'transform': 'translate(-50%, -50%) scale(7.04)'})),state('705',   style({'transform': 'translate(-50%, -50%) scale(7.05)'})),state('706',   style({'transform': 'translate(-50%, -50%) scale(7.06)'})),state('707',   style({'transform': 'translate(-50%, -50%) scale(7.07)'})),state('708',   style({'transform': 'translate(-50%, -50%) scale(7.08)'})),state('709',   style({'transform': 'translate(-50%, -50%) scale(7.09)'})),state('710',   style({'transform': 'translate(-50%, -50%) scale(7.1)'})),state('711',   style({'transform': 'translate(-50%, -50%) scale(7.11)'})),state('712',   style({'transform': 'translate(-50%, -50%) scale(7.12)'})),state('713',   style({'transform': 'translate(-50%, -50%) scale(7.13)'})),state('714',   style({'transform': 'translate(-50%, -50%) scale(7.14)'})),state('715',   style({'transform': 'translate(-50%, -50%) scale(7.15)'})),state('716',   style({'transform': 'translate(-50%, -50%) scale(7.16)'})),state('717',   style({'transform': 'translate(-50%, -50%) scale(7.17)'})),state('718',   style({'transform': 'translate(-50%, -50%) scale(7.18)'})),state('719',   style({'transform': 'translate(-50%, -50%) scale(7.19)'})),state('720',   style({'transform': 'translate(-50%, -50%) scale(7.2)'})),state('721',   style({'transform': 'translate(-50%, -50%) scale(7.21)'})),state('722',   style({'transform': 'translate(-50%, -50%) scale(7.22)'})),state('723',   style({'transform': 'translate(-50%, -50%) scale(7.23)'})),state('724',   style({'transform': 'translate(-50%, -50%) scale(7.24)'})),state('725',   style({'transform': 'translate(-50%, -50%) scale(7.25)'})),state('726',   style({'transform': 'translate(-50%, -50%) scale(7.26)'})),state('727',   style({'transform': 'translate(-50%, -50%) scale(7.27)'})),state('728',   style({'transform': 'translate(-50%, -50%) scale(7.28)'})),state('729',   style({'transform': 'translate(-50%, -50%) scale(7.29)'})),state('730',   style({'transform': 'translate(-50%, -50%) scale(7.3)'})),state('731',   style({'transform': 'translate(-50%, -50%) scale(7.31)'})),state('732',   style({'transform': 'translate(-50%, -50%) scale(7.32)'})),state('733',   style({'transform': 'translate(-50%, -50%) scale(7.33)'})),state('734',   style({'transform': 'translate(-50%, -50%) scale(7.34)'})),state('735',   style({'transform': 'translate(-50%, -50%) scale(7.35)'})),state('736',   style({'transform': 'translate(-50%, -50%) scale(7.36)'})),state('737',   style({'transform': 'translate(-50%, -50%) scale(7.37)'})),state('738',   style({'transform': 'translate(-50%, -50%) scale(7.38)'})),state('739',   style({'transform': 'translate(-50%, -50%) scale(7.39)'})),state('740',   style({'transform': 'translate(-50%, -50%) scale(7.4)'})),state('741',   style({'transform': 'translate(-50%, -50%) scale(7.41)'})),state('742',   style({'transform': 'translate(-50%, -50%) scale(7.42)'})),state('743',   style({'transform': 'translate(-50%, -50%) scale(7.43)'})),state('744',   style({'transform': 'translate(-50%, -50%) scale(7.44)'})),state('745',   style({'transform': 'translate(-50%, -50%) scale(7.45)'})),state('746',   style({'transform': 'translate(-50%, -50%) scale(7.46)'})),state('747',   style({'transform': 'translate(-50%, -50%) scale(7.47)'})),state('748',   style({'transform': 'translate(-50%, -50%) scale(7.48)'})),state('749',   style({'transform': 'translate(-50%, -50%) scale(7.49)'})),state('750',   style({'transform': 'translate(-50%, -50%) scale(7.5)'})),state('751',   style({'transform': 'translate(-50%, -50%) scale(7.51)'})),state('752',   style({'transform': 'translate(-50%, -50%) scale(7.52)'})),state('753',   style({'transform': 'translate(-50%, -50%) scale(7.53)'})),state('754',   style({'transform': 'translate(-50%, -50%) scale(7.54)'})),state('755',   style({'transform': 'translate(-50%, -50%) scale(7.55)'})),state('756',   style({'transform': 'translate(-50%, -50%) scale(7.56)'})),state('757',   style({'transform': 'translate(-50%, -50%) scale(7.57)'})),state('758',   style({'transform': 'translate(-50%, -50%) scale(7.58)'})),state('759',   style({'transform': 'translate(-50%, -50%) scale(7.59)'})),state('760',   style({'transform': 'translate(-50%, -50%) scale(7.6)'})),state('761',   style({'transform': 'translate(-50%, -50%) scale(7.61)'})),state('762',   style({'transform': 'translate(-50%, -50%) scale(7.62)'})),state('763',   style({'transform': 'translate(-50%, -50%) scale(7.63)'})),state('764',   style({'transform': 'translate(-50%, -50%) scale(7.64)'})),state('765',   style({'transform': 'translate(-50%, -50%) scale(7.65)'})),state('766',   style({'transform': 'translate(-50%, -50%) scale(7.66)'})),state('767',   style({'transform': 'translate(-50%, -50%) scale(7.67)'})),state('768',   style({'transform': 'translate(-50%, -50%) scale(7.68)'})),state('769',   style({'transform': 'translate(-50%, -50%) scale(7.69)'})),state('770',   style({'transform': 'translate(-50%, -50%) scale(7.7)'})),state('771',   style({'transform': 'translate(-50%, -50%) scale(7.71)'})),state('772',   style({'transform': 'translate(-50%, -50%) scale(7.72)'})),state('773',   style({'transform': 'translate(-50%, -50%) scale(7.73)'})),state('774',   style({'transform': 'translate(-50%, -50%) scale(7.74)'})),state('775',   style({'transform': 'translate(-50%, -50%) scale(7.75)'})),state('776',   style({'transform': 'translate(-50%, -50%) scale(7.76)'})),state('777',   style({'transform': 'translate(-50%, -50%) scale(7.77)'})),state('778',   style({'transform': 'translate(-50%, -50%) scale(7.78)'})),state('779',   style({'transform': 'translate(-50%, -50%) scale(7.79)'})),state('780',   style({'transform': 'translate(-50%, -50%) scale(7.8)'})),state('781',   style({'transform': 'translate(-50%, -50%) scale(7.81)'})),state('782',   style({'transform': 'translate(-50%, -50%) scale(7.82)'})),state('783',   style({'transform': 'translate(-50%, -50%) scale(7.83)'})),state('784',   style({'transform': 'translate(-50%, -50%) scale(7.84)'})),state('785',   style({'transform': 'translate(-50%, -50%) scale(7.85)'})),state('786',   style({'transform': 'translate(-50%, -50%) scale(7.86)'})),state('787',   style({'transform': 'translate(-50%, -50%) scale(7.87)'})),state('788',   style({'transform': 'translate(-50%, -50%) scale(7.88)'})),state('789',   style({'transform': 'translate(-50%, -50%) scale(7.89)'})),state('790',   style({'transform': 'translate(-50%, -50%) scale(7.9)'})),state('791',   style({'transform': 'translate(-50%, -50%) scale(7.91)'})),state('792',   style({'transform': 'translate(-50%, -50%) scale(7.92)'})),state('793',   style({'transform': 'translate(-50%, -50%) scale(7.93)'})),state('794',   style({'transform': 'translate(-50%, -50%) scale(7.94)'})),state('795',   style({'transform': 'translate(-50%, -50%) scale(7.95)'})),state('796',   style({'transform': 'translate(-50%, -50%) scale(7.96)'})),state('797',   style({'transform': 'translate(-50%, -50%) scale(7.97)'})),state('798',   style({'transform': 'translate(-50%, -50%) scale(7.98)'})),state('799',   style({'transform': 'translate(-50%, -50%) scale(7.99)'})),state('800',   style({'transform': 'translate(-50%, -50%) scale(8)'})),state('801',   style({'transform': 'translate(-50%, -50%) scale(8.01)'})),state('802',   style({'transform': 'translate(-50%, -50%) scale(8.02)'})),state('803',   style({'transform': 'translate(-50%, -50%) scale(8.03)'})),state('804',   style({'transform': 'translate(-50%, -50%) scale(8.04)'})),state('805',   style({'transform': 'translate(-50%, -50%) scale(8.05)'})),state('806',   style({'transform': 'translate(-50%, -50%) scale(8.06)'})),state('807',   style({'transform': 'translate(-50%, -50%) scale(8.07)'})),state('808',   style({'transform': 'translate(-50%, -50%) scale(8.08)'})),state('809',   style({'transform': 'translate(-50%, -50%) scale(8.09)'})),state('810',   style({'transform': 'translate(-50%, -50%) scale(8.1)'})),state('811',   style({'transform': 'translate(-50%, -50%) scale(8.11)'})),state('812',   style({'transform': 'translate(-50%, -50%) scale(8.12)'})),state('813',   style({'transform': 'translate(-50%, -50%) scale(8.13)'})),state('814',   style({'transform': 'translate(-50%, -50%) scale(8.14)'})),state('815',   style({'transform': 'translate(-50%, -50%) scale(8.15)'})),state('816',   style({'transform': 'translate(-50%, -50%) scale(8.16)'})),state('817',   style({'transform': 'translate(-50%, -50%) scale(8.17)'})),state('818',   style({'transform': 'translate(-50%, -50%) scale(8.18)'})),state('819',   style({'transform': 'translate(-50%, -50%) scale(8.19)'})),state('820',   style({'transform': 'translate(-50%, -50%) scale(8.2)'})),state('821',   style({'transform': 'translate(-50%, -50%) scale(8.21)'})),state('822',   style({'transform': 'translate(-50%, -50%) scale(8.22)'})),state('823',   style({'transform': 'translate(-50%, -50%) scale(8.23)'})),state('824',   style({'transform': 'translate(-50%, -50%) scale(8.24)'})),state('825',   style({'transform': 'translate(-50%, -50%) scale(8.25)'})),state('826',   style({'transform': 'translate(-50%, -50%) scale(8.26)'})),state('827',   style({'transform': 'translate(-50%, -50%) scale(8.27)'})),state('828',   style({'transform': 'translate(-50%, -50%) scale(8.28)'})),state('829',   style({'transform': 'translate(-50%, -50%) scale(8.29)'})),state('830',   style({'transform': 'translate(-50%, -50%) scale(8.3)'})),state('831',   style({'transform': 'translate(-50%, -50%) scale(8.31)'})),state('832',   style({'transform': 'translate(-50%, -50%) scale(8.32)'})),state('833',   style({'transform': 'translate(-50%, -50%) scale(8.33)'})),state('834',   style({'transform': 'translate(-50%, -50%) scale(8.34)'})),state('835',   style({'transform': 'translate(-50%, -50%) scale(8.35)'})),state('836',   style({'transform': 'translate(-50%, -50%) scale(8.36)'})),state('837',   style({'transform': 'translate(-50%, -50%) scale(8.37)'})),state('838',   style({'transform': 'translate(-50%, -50%) scale(8.38)'})),state('839',   style({'transform': 'translate(-50%, -50%) scale(8.39)'})),state('840',   style({'transform': 'translate(-50%, -50%) scale(8.4)'})),state('841',   style({'transform': 'translate(-50%, -50%) scale(8.41)'})),state('842',   style({'transform': 'translate(-50%, -50%) scale(8.42)'})),state('843',   style({'transform': 'translate(-50%, -50%) scale(8.43)'})),state('844',   style({'transform': 'translate(-50%, -50%) scale(8.44)'})),state('845',   style({'transform': 'translate(-50%, -50%) scale(8.45)'})),state('846',   style({'transform': 'translate(-50%, -50%) scale(8.46)'})),state('847',   style({'transform': 'translate(-50%, -50%) scale(8.47)'})),state('848',   style({'transform': 'translate(-50%, -50%) scale(8.48)'})),state('849',   style({'transform': 'translate(-50%, -50%) scale(8.49)'})),state('850',   style({'transform': 'translate(-50%, -50%) scale(8.5)'})),state('851',   style({'transform': 'translate(-50%, -50%) scale(8.51)'})),state('852',   style({'transform': 'translate(-50%, -50%) scale(8.52)'})),state('853',   style({'transform': 'translate(-50%, -50%) scale(8.53)'})),state('854',   style({'transform': 'translate(-50%, -50%) scale(8.54)'})),state('855',   style({'transform': 'translate(-50%, -50%) scale(8.55)'})),state('856',   style({'transform': 'translate(-50%, -50%) scale(8.56)'})),state('857',   style({'transform': 'translate(-50%, -50%) scale(8.57)'})),state('858',   style({'transform': 'translate(-50%, -50%) scale(8.58)'})),state('859',   style({'transform': 'translate(-50%, -50%) scale(8.59)'})),state('860',   style({'transform': 'translate(-50%, -50%) scale(8.6)'})),state('861',   style({'transform': 'translate(-50%, -50%) scale(8.61)'})),state('862',   style({'transform': 'translate(-50%, -50%) scale(8.62)'})),state('863',   style({'transform': 'translate(-50%, -50%) scale(8.63)'})),state('864',   style({'transform': 'translate(-50%, -50%) scale(8.64)'})),state('865',   style({'transform': 'translate(-50%, -50%) scale(8.65)'})),state('866',   style({'transform': 'translate(-50%, -50%) scale(8.66)'})),state('867',   style({'transform': 'translate(-50%, -50%) scale(8.67)'})),state('868',   style({'transform': 'translate(-50%, -50%) scale(8.68)'})),state('869',   style({'transform': 'translate(-50%, -50%) scale(8.69)'})),state('870',   style({'transform': 'translate(-50%, -50%) scale(8.7)'})),state('871',   style({'transform': 'translate(-50%, -50%) scale(8.71)'})),state('872',   style({'transform': 'translate(-50%, -50%) scale(8.72)'})),state('873',   style({'transform': 'translate(-50%, -50%) scale(8.73)'})),state('874',   style({'transform': 'translate(-50%, -50%) scale(8.74)'})),state('875',   style({'transform': 'translate(-50%, -50%) scale(8.75)'})),state('876',   style({'transform': 'translate(-50%, -50%) scale(8.76)'})),state('877',   style({'transform': 'translate(-50%, -50%) scale(8.77)'})),state('878',   style({'transform': 'translate(-50%, -50%) scale(8.78)'})),state('879',   style({'transform': 'translate(-50%, -50%) scale(8.79)'})),state('880',   style({'transform': 'translate(-50%, -50%) scale(8.8)'})),state('881',   style({'transform': 'translate(-50%, -50%) scale(8.81)'})),state('882',   style({'transform': 'translate(-50%, -50%) scale(8.82)'})),state('883',   style({'transform': 'translate(-50%, -50%) scale(8.83)'})),state('884',   style({'transform': 'translate(-50%, -50%) scale(8.84)'})),state('885',   style({'transform': 'translate(-50%, -50%) scale(8.85)'})),state('886',   style({'transform': 'translate(-50%, -50%) scale(8.86)'})),state('887',   style({'transform': 'translate(-50%, -50%) scale(8.87)'})),state('888',   style({'transform': 'translate(-50%, -50%) scale(8.88)'})),state('889',   style({'transform': 'translate(-50%, -50%) scale(8.89)'})),state('890',   style({'transform': 'translate(-50%, -50%) scale(8.9)'})),state('891',   style({'transform': 'translate(-50%, -50%) scale(8.91)'})),state('892',   style({'transform': 'translate(-50%, -50%) scale(8.92)'})),state('893',   style({'transform': 'translate(-50%, -50%) scale(8.93)'})),state('894',   style({'transform': 'translate(-50%, -50%) scale(8.94)'})),state('895',   style({'transform': 'translate(-50%, -50%) scale(8.95)'})),state('896',   style({'transform': 'translate(-50%, -50%) scale(8.96)'})),state('897',   style({'transform': 'translate(-50%, -50%) scale(8.97)'})),state('898',   style({'transform': 'translate(-50%, -50%) scale(8.98)'})),state('899',   style({'transform': 'translate(-50%, -50%) scale(8.99)'})),state('900',   style({'transform': 'translate(-50%, -50%) scale(9)'})),state('901',   style({'transform': 'translate(-50%, -50%) scale(9.01)'})),state('902',   style({'transform': 'translate(-50%, -50%) scale(9.02)'})),state('903',   style({'transform': 'translate(-50%, -50%) scale(9.03)'})),state('904',   style({'transform': 'translate(-50%, -50%) scale(9.04)'})),state('905',   style({'transform': 'translate(-50%, -50%) scale(9.05)'})),state('906',   style({'transform': 'translate(-50%, -50%) scale(9.06)'})),state('907',   style({'transform': 'translate(-50%, -50%) scale(9.07)'})),state('908',   style({'transform': 'translate(-50%, -50%) scale(9.08)'})),state('909',   style({'transform': 'translate(-50%, -50%) scale(9.09)'})),state('910',   style({'transform': 'translate(-50%, -50%) scale(9.1)'})),state('911',   style({'transform': 'translate(-50%, -50%) scale(9.11)'})),state('912',   style({'transform': 'translate(-50%, -50%) scale(9.12)'})),state('913',   style({'transform': 'translate(-50%, -50%) scale(9.13)'})),state('914',   style({'transform': 'translate(-50%, -50%) scale(9.14)'})),state('915',   style({'transform': 'translate(-50%, -50%) scale(9.15)'})),state('916',   style({'transform': 'translate(-50%, -50%) scale(9.16)'})),state('917',   style({'transform': 'translate(-50%, -50%) scale(9.17)'})),state('918',   style({'transform': 'translate(-50%, -50%) scale(9.18)'})),state('919',   style({'transform': 'translate(-50%, -50%) scale(9.19)'})),state('920',   style({'transform': 'translate(-50%, -50%) scale(9.2)'})),state('921',   style({'transform': 'translate(-50%, -50%) scale(9.21)'})),state('922',   style({'transform': 'translate(-50%, -50%) scale(9.22)'})),state('923',   style({'transform': 'translate(-50%, -50%) scale(9.23)'})),state('924',   style({'transform': 'translate(-50%, -50%) scale(9.24)'})),state('925',   style({'transform': 'translate(-50%, -50%) scale(9.25)'})),state('926',   style({'transform': 'translate(-50%, -50%) scale(9.26)'})),state('927',   style({'transform': 'translate(-50%, -50%) scale(9.27)'})),state('928',   style({'transform': 'translate(-50%, -50%) scale(9.28)'})),state('929',   style({'transform': 'translate(-50%, -50%) scale(9.29)'})),state('930',   style({'transform': 'translate(-50%, -50%) scale(9.3)'})),state('931',   style({'transform': 'translate(-50%, -50%) scale(9.31)'})),state('932',   style({'transform': 'translate(-50%, -50%) scale(9.32)'})),state('933',   style({'transform': 'translate(-50%, -50%) scale(9.33)'})),state('934',   style({'transform': 'translate(-50%, -50%) scale(9.34)'})),state('935',   style({'transform': 'translate(-50%, -50%) scale(9.35)'})),state('936',   style({'transform': 'translate(-50%, -50%) scale(9.36)'})),state('937',   style({'transform': 'translate(-50%, -50%) scale(9.37)'})),state('938',   style({'transform': 'translate(-50%, -50%) scale(9.38)'})),state('939',   style({'transform': 'translate(-50%, -50%) scale(9.39)'})),state('940',   style({'transform': 'translate(-50%, -50%) scale(9.4)'})),state('941',   style({'transform': 'translate(-50%, -50%) scale(9.41)'})),state('942',   style({'transform': 'translate(-50%, -50%) scale(9.42)'})),state('943',   style({'transform': 'translate(-50%, -50%) scale(9.43)'})),state('944',   style({'transform': 'translate(-50%, -50%) scale(9.44)'})),state('945',   style({'transform': 'translate(-50%, -50%) scale(9.45)'})),state('946',   style({'transform': 'translate(-50%, -50%) scale(9.46)'})),state('947',   style({'transform': 'translate(-50%, -50%) scale(9.47)'})),state('948',   style({'transform': 'translate(-50%, -50%) scale(9.48)'})),state('949',   style({'transform': 'translate(-50%, -50%) scale(9.49)'})),state('950',   style({'transform': 'translate(-50%, -50%) scale(9.5)'})),state('951',   style({'transform': 'translate(-50%, -50%) scale(9.51)'})),state('952',   style({'transform': 'translate(-50%, -50%) scale(9.52)'})),state('953',   style({'transform': 'translate(-50%, -50%) scale(9.53)'})),state('954',   style({'transform': 'translate(-50%, -50%) scale(9.54)'})),state('955',   style({'transform': 'translate(-50%, -50%) scale(9.55)'})),state('956',   style({'transform': 'translate(-50%, -50%) scale(9.56)'})),state('957',   style({'transform': 'translate(-50%, -50%) scale(9.57)'})),state('958',   style({'transform': 'translate(-50%, -50%) scale(9.58)'})),state('959',   style({'transform': 'translate(-50%, -50%) scale(9.59)'})),state('960',   style({'transform': 'translate(-50%, -50%) scale(9.6)'})),state('961',   style({'transform': 'translate(-50%, -50%) scale(9.61)'})),state('962',   style({'transform': 'translate(-50%, -50%) scale(9.62)'})),state('963',   style({'transform': 'translate(-50%, -50%) scale(9.63)'})),state('964',   style({'transform': 'translate(-50%, -50%) scale(9.64)'})),state('965',   style({'transform': 'translate(-50%, -50%) scale(9.65)'})),state('966',   style({'transform': 'translate(-50%, -50%) scale(9.66)'})),state('967',   style({'transform': 'translate(-50%, -50%) scale(9.67)'})),state('968',   style({'transform': 'translate(-50%, -50%) scale(9.68)'})),state('969',   style({'transform': 'translate(-50%, -50%) scale(9.69)'})),state('970',   style({'transform': 'translate(-50%, -50%) scale(9.7)'})),state('971',   style({'transform': 'translate(-50%, -50%) scale(9.71)'})),state('972',   style({'transform': 'translate(-50%, -50%) scale(9.72)'})),state('973',   style({'transform': 'translate(-50%, -50%) scale(9.73)'})),state('974',   style({'transform': 'translate(-50%, -50%) scale(9.74)'})),state('975',   style({'transform': 'translate(-50%, -50%) scale(9.75)'})),state('976',   style({'transform': 'translate(-50%, -50%) scale(9.76)'})),state('977',   style({'transform': 'translate(-50%, -50%) scale(9.77)'})),state('978',   style({'transform': 'translate(-50%, -50%) scale(9.78)'})),state('979',   style({'transform': 'translate(-50%, -50%) scale(9.79)'})),state('980',   style({'transform': 'translate(-50%, -50%) scale(9.8)'})),state('981',   style({'transform': 'translate(-50%, -50%) scale(9.81)'})),state('982',   style({'transform': 'translate(-50%, -50%) scale(9.82)'})),state('983',   style({'transform': 'translate(-50%, -50%) scale(9.83)'})),state('984',   style({'transform': 'translate(-50%, -50%) scale(9.84)'})),state('985',   style({'transform': 'translate(-50%, -50%) scale(9.85)'})),state('986',   style({'transform': 'translate(-50%, -50%) scale(9.86)'})),state('987',   style({'transform': 'translate(-50%, -50%) scale(9.87)'})),state('988',   style({'transform': 'translate(-50%, -50%) scale(9.88)'})),state('989',   style({'transform': 'translate(-50%, -50%) scale(9.89)'})),state('990',   style({'transform': 'translate(-50%, -50%) scale(9.9)'})),state('991',   style({'transform': 'translate(-50%, -50%) scale(9.91)'})),state('992',   style({'transform': 'translate(-50%, -50%) scale(9.92)'})),state('993',   style({'transform': 'translate(-50%, -50%) scale(9.93)'})),state('994',   style({'transform': 'translate(-50%, -50%) scale(9.94)'})),state('995',   style({'transform': 'translate(-50%, -50%) scale(9.95)'})),state('996',   style({'transform': 'translate(-50%, -50%) scale(9.96)'})),state('997',   style({'transform': 'translate(-50%, -50%) scale(9.97)'})),state('998',   style({'transform': 'translate(-50%, -50%) scale(9.98)'})),state('999',   style({'transform': 'translate(-50%, -50%) scale(9.99)'})),
            transition('* <=> *', animate('50ms ease-in-out') ),
            transition('void => *', [])
        ]),
        trigger('pin', [
            state('hide', style({opacity: 0})),
            state('show', style({opacity: 1})),
            transition('* => show',
                animate('700ms ease-out',
                    keyframes([
                        style({transform: 'translateY(-400%)', opacity: 0, offset: 0}),
                        style({transform: 'translateY(0%)', opacity: 1, offset:1})
                    ])
                )
            )
        ]),
        trigger('showmap', [
            state('hide', style({ opacity: 0 })),
            state('show', style({ opacity: 1 })),
            transition('* <=> *', animate('700ms ease-out'))
        ])
    ]
})
export class InteractiveMap {
    @Input() map: string;
    @Input() zoomMax: number = 200;
    @Input() zoom: number = 0;
    @Input() controls: boolean = true;
    @Input() disable: string[] = [];
    @Input() pins: any[] = [];
    @Input() mapSize: any = 100;
    @Input() focus: any;
    @Input() focusScroll: boolean = false;
    @Input() focusZoom: number = 80;
    @Input() padding: string = '2.0em';
    @Input() color: string = '#000';
    @Input() mapStyles: { id: string, color: string, fill: string, opacity: string }[] = [];
    @Output() tap = new EventEmitter();
    @Output() zoomChange = new EventEmitter();
    @Output() mapUpdated = new EventEmitter();

    //*
    //Toggle Knob
    @ViewChild('displayarea')  self: ElementRef;
    @ViewChild('maparea')  map_area: ElementRef;
    @ViewChild('mapdisplay')  map_display: ElementRef;
    prev_map_styles: { id: string, color: string, fill: string, opacity: string }[] = [];
    map_style_ids: string[] = [];
    content_box: any;
    map_box: any;
    map_data: any;
    map_item: any;
    touchmap: any;
    private o_zoom: number = 0;
    private _zoom: number = 0; // As Percentage
    rotate: number = 0; // In degrees
    zoomed: boolean = false;
    map_shown: boolean = false;
    debug: string[] = [];
    map_orientation: string = '';
    activate: boolean = false;
    de: any;
    active = false;
    min = 20;
    isFocus = false;
    loading = true;
    zoom_state: string = '100w';
    center: any = { x: 0.5, y: 0.5 };
    next_center: any = { x: 0.5, y: 0.5 };
    min_center: any = { x: 0.5, y: 0.5 };
    max_center: any = { x: 0.5, y: 0.5 };

    pin_html = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 53 65.7" style="enable-background:new 0 0 53 65.7;" xml:space="preserve">
    <style type="text/css">
    .aca-st0{fill:#FFFFFF;} .aca-st1{fill:#DC6900;stroke:#FFFFFF;stroke-width:2.5;stroke-miterlimit:10;}
    </style>
    <g>
    <circle class="aca-st0" cx="27.6" cy="21.8" r="13.1"/>
    <path class="aca-st1" d="M27.6,4c9.9,0,18,8.1,18,18s-17.1,38.2-18,39.6c-0.9-1.5-18-29.7-18-39.6S17.7,4,27.6,4z M27.6,32.8 c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8S16.8,16,16.8,22S21.6,32.8,27.6,32.8"/>
    </g>
    </svg>
    `

    pin_defaults = {
        x: 0,
        y: 0,
        colors : {
            one: '#DC6900',
            two : '#FFFFFF'
        }
    }

    pin_cnt: number = 0;
    box_update: any = null;
    draw: any = null;
    drawing: any = null;
    status_check: any = null;
    zoom_bb: any = null;
    move_timer: any = null;
    run_update: any = null;

    constructor(private a: ACA_Animate, private service: MapService){
        this.status_check = setInterval(() => {
            this.checkStatus(null, 0);
        }, 1000);
        /*
        this.run_update = setInterval(() => {
        if(this.active) {
        this.redraw();
    }
}, 50);
//*/
}

ngOnInit(){
    this.setupUpdate();

    this.draw = this.a.animation(() => {
        setTimeout(() => {
            this.updatePins();
        }, 20);
        return this.update();
    }, () => {
        this.render();
        setTimeout(() => {
            this.updatePins();
        }, 60);
    });
    this.checkStatus(null, 0);
    this.o_zoom = this._zoom;
}

ngOnDestroy() {
    if(this.status_check) {
        clearInterval(this.status_check);
    }
    if(this.run_update) {
        clearInterval(this.run_update);
    }
}

update() {
    this.updateValues();
    this.checkValues();
    // Clean up any dimension changes
    this.rotate = this.rotate % 360;
    let p_z_state = this.zoom_state;
    this.zoom_state = Math.round(100 + this.o_zoom).toString();
    if(this.zoom_state !== p_z_state) {
        setTimeout(() => {
            this.updateBoxes();
        }, 60);
    }
    return true;
}

updateValues() {
    // Update zoom
    this.o_zoom += this.moveTo(this.o_zoom, this._zoom);
    //this.o_zoom = (this._zoom);
    // Update Position
}

checkValues(force: boolean = false) {
    // Check zoom is valid
    if(!this.isFocus || force) {
        if(this._zoom > this.zoomMax || this._zoom > ZOOM_LIMIT) this._zoom = this.zoomMax;
        else if (this._zoom < -50) this._zoom = -50;
        else if(!this._zoom) this._zoom = 0;
        this.zoomChange.emit(this._zoom);
        // Check position is valid
        if(!this.focus) {
            if(this.center.x < this.min_center.x) this.center.x = this.min_center.x;
            else if(this.center.x > this.max_center.x) this.center.x = this.max_center.x;

            if(this.center.y < this.min_center.y) this.center.y = this.min_center.y;
            else if(this.center.y > this.max_center.y) this.center.y = this.max_center.y;
        } else {
            if(this.center.x < 0) this.center.x = 0;
            else if(this.center.x > 1) this.center.x = 1;

            if(this.center.y < 0) this.center.y = 0;
            else if(this.center.y > 1) this.center.y = 1;
        }
    }
}

render() {
    // Update map
    if(this.map_item && this.active) {
        //this.updateBoxes();
        if(this.content_box && this.map_item) {
            let mbb = this.map_item.getBoundingClientRect();
            if(mbb){
                let top = Math.round(-mbb.height * this.center.y + this.content_box.height/2);
                let left = Math.round(-mbb.width * this.center.x + this.content_box.width/2);
                let x = -(this.center.x * 100);
                let y = -(this.center.y * 100);
                this.map_item.style.transform = `translate(${x}%, ${y}%)`;
            }
        }
        if(this.isFocus) this.finishFocus();
    }
}

moveTo(from: number, to: number, max: number = 50) {
    let dir = from - to < 0 ? 1 : -1;
    return dir * Math.min(Math.abs(from - to), max);
}

clearDisabled(strs:string[]) {
    if(this.map_display) {
        for(let i = 0; i < strs.length; i++) {
            let el = this.map_display.nativeElement.querySelector('#' + this.escape(strs[i]));
            if(el !== null) {
                el.style.display = 'inherit';
            }
        }
    }
}

setupDisabled() {
    if(this.active && this.map_display) {
        for(let i = 0; i < this.disable.length; i++) {
            let el = this.map_display.nativeElement.querySelector('#' + this.escape(this.disable[i]));
            if(el !== null) {
                el.style.display = 'none';
            }
        }
    }
}

setupStyles() {
    // Clear previous color changes
    if(this.prev_map_styles && this.prev_map_styles.length > 0) {
        for(let i = 0; i < this.prev_map_styles.length; i++) {
            let style = this.prev_map_styles[i];
            let el = this.map_area.nativeElement.querySelector('#' + this.escape(style.id));
            if(el) {
                if(style.color !== undefined && style.color !== null) el.style.color = style.color;
                if(style.opacity !== undefined && style.opacity !== null) el.style.opacity = style.opacity;
                if(style.fill !== undefined && style.fill !== null) el.style.fill = style.fill;
            }
        }
    }
    if(!this.mapStyles || !this.map_item) return;
    for(let i = 0; i < this.mapStyles.length; i++){
        let style = this.mapStyles[i];
        let el = this.map_area.nativeElement.querySelector('#' + this.escape(style.id));
        if(el && style.id !== '') {
            let old_style = JSON.parse(JSON.stringify(style));
            if(style.color) {
                old_style.color = el.style.color;
                el.style.color = style.color;
            }
            if(style.opacity) {
                old_style.opacity = el.style.opacity;
                el.style.opacity = style.opacity;
            }
            if(style.fill) {
                old_style.fill = el.style.fill;
                el.style.fill = style.fill;
            }
            if(this.map_style_ids.indexOf(style.id) < 0) {
                this.prev_map_styles.push(old_style);
                this.map_style_ids.push(style.id);
            }
        }
    }
}

clearPins() {
    this.pins = [];
}

isVisible() {
    if(this.self) {
        //Check if the map area is visiable
        let bb = this.self.nativeElement.getBoundingClientRect();
        if(bb.left + bb.width < 0) return false;
        else if(bb.top + bb.height < 0) return false;
        else if(bb.top > window.innerHeight) return false;
        else if(bb.left > window.innerWidth) return false;
        return true;
    }
    return false;
}

setupPins() {
    if(this.active && this.pins) {
        this.pin_cnt = this.pins.length;
        setTimeout(() => {
            for(let i = 0; i < this.pins.length; i++) {
                let pin = this.pins[i];
                if(typeof pin !== 'object') {
                    pin = this.pin_defaults;
                } else {
                    if(!pin.x&&!pin.map_id) pin.x = this.pin_defaults.x;
                    if(!pin.y&&!pin.map_id) pin.x = this.pin_defaults.y;
                    if(!pin.colors) pin.x = this.pin_defaults.colors;
                    else {
                        if(!pin.colors.one   || pin.colors.one.length > 25) pin.colors.one = this.pin_defaults.colors.one;
                        if(!pin.colors.two   || pin.colors.one.length > 25) pin.colors.two = this.pin_defaults.colors.two;
                    }
                }
                let el = this.map_area.nativeElement.querySelector('#aca-map-pin' + i);
                if(el !== null) {
                    let html = this.getPin(pin, i);
                    let text = el.children[el.children.length-1];
                    el.innerHTML = html;
                    if(text) el.appendChild(text);
                }
                this.pins[i].status = 'show';
            }
            this.updatePins();
        }, 20);
    }
}

updatePins() {
    if(!this.map_item || !this.map_area) return;
    for(let i = 0; i < this.pins.length; i++) {
        let pin = this.pins[i];
        let el = this.map_area.nativeElement.querySelector('#aca-map-pin' + i);
        if(el) {
            // Get bounding rectangles
            let ebb = el.getBoundingClientRect();
            let cbb = this.map_area.nativeElement.getBoundingClientRect();
            let mb = this.map_item.getBoundingClientRect();
            let elc = this.map_display.nativeElement.querySelector('#' + this.escape(pin.id));
            if(elc || (pin.x && pin.y)) {
                el.style.display = '';
                // Get map scale
                let dir = this.map_box ? (mb.width > mb.height) : true;
                let map_x = Math.ceil(dir ? this.mapSize : (this.mapSize * (mb.width / mb.height)));
                let map_y = Math.ceil(!dir ? this.mapSize : (this.mapSize * (mb.height / mb.width)));

                let p_y = Math.round((pin.y ? Math.min(map_y, pin.y) / map_y : mb.width / mb.height) * mb.height);
                let p_x = Math.round((pin.x ? Math.min(map_x, pin.x) / map_x : 1) * mb.width);
                // Get bounding rectangle of pin location
                let ccbb = {
                    width: 2, height: 2,
                    left: p_x + (mb.left - cbb.left) + cbb.left,
                    top: p_y + (mb.top - cbb.top) + cbb.top
                }
                let bb = pin.id && pin.id !== '' && elc ? elc.getBoundingClientRect() : ccbb;
                // Get pin location
                let y = (bb.top + bb.height/2) - el.clientHeight - cbb.top;
                let x = (bb.left + bb.width/2) - el.clientWidth/2 - cbb.left;
                // Update pin display location.
                el.style.top = Math.round(y) + 'px';
                el.style.left = Math.round(x) + 'px';
            } else {
                el.style.display = 'none';
            }
        }
    }
}

escape (value: string) {
    var string = String(value);
    var length = string.length;
    var index = -1;
    var codeUnit: any;
    var result = '';
    var firstCodeUnit = string.charCodeAt(0);
    while (++index < length) {
        codeUnit = string.charCodeAt(index);
        // Note: there’s no need to special-case astral symbols, surrogate
        // pairs, or lone surrogates.

        // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
        // (U+FFFD).
        if (codeUnit == 0x0000) {
            result += '\uFFFD';
            continue;
        }

        if (
            // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
            // U+007F, […]
            (codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
            // If the character is the first character and is in the range [0-9]
            // (U+0030 to U+0039), […]
            (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
            // If the character is the second character and is in the range [0-9]
            // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
            (
                index == 1 &&
                codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
                firstCodeUnit == 0x002D
            )
        ) {
            // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
            result += '\\' + codeUnit.toString(16) + ' ';
            continue;
        }

        if (
            // If the character is the first character and is a `-` (U+002D), and
            // there is no second character, […]
            index == 0 &&
            length == 1 &&
            codeUnit == 0x002D
        ) {
            result += '\\' + string.charAt(index);
            continue;
        }

        // If the character is not handled by one of the above rules and is
        // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
        // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
        // U+005A), or [a-z] (U+0061 to U+007A), […]
        if (
            codeUnit >= 0x0080 ||
            codeUnit == 0x002D ||
            codeUnit == 0x005F ||
            codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
            codeUnit >= 0x0041 && codeUnit <= 0x005A ||
            codeUnit >= 0x0061 && codeUnit <= 0x007A
        ) {
            // the character itself
            result += string.charAt(index);
            continue;
        }

        // Otherwise, the escaped character.
        // https://drafts.csswg.org/cssom/#escape-a-character
        result += '\\' + string.charAt(index);

    }
    return result;
}

getPin(data: any, i: number) {
    let pin = this.pin_html;
    pin = this.replaceAll(pin, '#DC6900', data.colors.one);
    pin = this.replaceAll(pin, '#FFFFFF', data.colors.two);
    pin = this.replaceAll(pin, 'aca-', ('aca-' + i + '-'));
    return pin;
}

private replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
}

ngAfterViewInit() {
}

setupEvents() {
    this.setupPins();
    if(this.focus) this.updateFocus();
}

checkStatus(e: any, i: number) {
    if(i > 2) return;
    let visible = false;
    let el = this.self.nativeElement;
    while(el) {
        if(el.nodeName === 'BODY') {
            visible = true;
            break;
        }
        el = el.parentNode;
    }
    if(visible) visible = this.isVisible();
    if(!visible) {
        this.active = false;
        this.loading = true;
        //setTimeout(() => { this.checkStatus(e, i+1); }, 50);
    } else {
        if(this.active !== visible)  {
            this.active = true;
            setTimeout(() => {
                this.loadMapData();
            }, 100);
        }
    }
}

ngOnChanges(changes: any) {
    if(changes.map){
        this.o_zoom = 0;
        this._zoom = 0;
        this.center = { x: 0.5, y: 0.5 };
        this.loadMapData();
    }
    if(changes.zoom && this.zoom !== this._zoom) {
        this._zoom = this.zoom;
        this.checkValues(true);
        if(this.draw !== null) this.updateBoxes();
    }
    if(changes.disable) {
        let pv = changes.disable.previousValue;
        if(pv !== null && pv !== undefined) this.clearDisabled(pv);
        this.setupDisabled();
    }
    if(changes.pins && this.pins) {
        this.pin_cnt = this.pins.length;
        this.setupPins();
    }
    if(changes.mapStyles) {
        this.setupStyles();
    }
    if(changes.focus) {
        this.o_zoom = 0;
        this._zoom = 0;
        this.updateFocus();
    }
}

updateFocus() {
    if(!this.map_display || !this.map_data) return;
    if(this.focus === null || this.focus === undefined || this.focus === '') return;
    this.zoomMax = 2000;
    if(this.map_item && this.map_area) {
        let bb = this.getFocusBB();
        if(bb) this.zoomFocus(bb);
        else this.retryFocus();
    } else this.retryFocus();
}

zoomFocus(bb: any) {
    if(!this.map_item || !this.map_area) return;
    let cbb = this.map_item.getBoundingClientRect();
    let mbb = this.map_area.nativeElement.getBoundingClientRect();
    if(cbb && mbb && bb) {
        this.zoom_bb = bb;
        setTimeout(() => {
            let w_ratio = mbb.width  / bb.width  * (cbb.width / mbb.width );
            let h_ratio = mbb.height  / bb.height  * (cbb.height / mbb.height );
            let r = (w_ratio < h_ratio ? w_ratio : h_ratio) * ( typeof this.focus === 'string' ? 0.5 : 1.5);
            this._zoom = Math.round((isNaN(r) ? 1 : r) * this.focusZoom);
            this.isFocus = true;
            this.redraw()
            this.updateBoxes();

        }, 20);
    }
}

retryFocus() {
    setTimeout(() => {
        this.updateFocus();
    }, 100)
}

getFocusBB() {
    if(this.focus && typeof this.focus === 'string' && this.focus !== '') {
        let el = this.map_display.nativeElement.querySelector('#' + this.escape(this.focus));
        if(el !== null) {
            this.zoom_bb = el.getBoundingClientRect();
        }
    } else if(this.focus && typeof this.focus === 'object') {
        if(!this.map_item || !this.map_area) return;
        if(this.focus.x > 0 && this.focus.y > 0) {
            // Get content bounding boxes
            let cbb = this.map_area.nativeElement.getBoundingClientRect();
            let mb = this.map_item.getBoundingClientRect();
            // Get point position
            let dir = this.map_box ? (mb.width > mb.height) : true;
            let map_x = Math.ceil(dir ? this.mapSize : (this.mapSize * (mb.width / mb.height)));
            let map_y = Math.ceil(!dir ? this.mapSize : (this.mapSize * (mb.height / mb.width)));

            let p_y = Math.round((this.focus.y ? Math.min(map_y, this.focus.y) / map_y : mb.width / mb.height) * mb.height);
            let p_x = Math.round((this.focus.x ? Math.min(map_x, this.focus.x) / map_x : 1) * mb.width);
            // Get bounding rectangle of pin location
            let ccbb = {
                width: 128, height: 128,
                left: p_x + (mb.left - cbb.left) + cbb.left,
                top: p_y + (mb.top - cbb.top) + cbb.top
            }
            this.zoom_bb = ccbb;
        }
    }
    return this.zoom_bb;
}

finishFocus() {
    this.isFocus = false;
    let cnt = 0;
    let interval = setInterval(() => {
        if(!this.map_item || !this.map_area) return;
        // Get content bounding boxes
        let cbb = this.map_area.nativeElement.getBoundingClientRect();
        let mbb = this.map_item.getBoundingClientRect();
        let coord = typeof this.focus === 'object' && this.focus.x && this.focus.y;
        this.getFocusBB();
        let bb = this.zoom_bb;
        let x = bb.left + bb.width/2 - mbb.left;
        let y = bb.top + bb.height/2 - mbb.top;
        this.focusOnPoint(x, y);

        this.zoom_bb = null;
        this.updateBoxes();
        cnt++;
        if(cnt > 5) {
            setTimeout(() => {
                this.zoomChange.emit(this._zoom);
            }, 100);
            clearInterval(interval);
        }
    }, 50);
}

focusOnPoint(x: number, y: number) {
    if(!this.map_item) return;
    let mbb = this.map_item.getBoundingClientRect();
    let r_x = x / mbb.width;
    let r_y = y / mbb.height;
    this.center = { x: r_x, y: r_y };
    this.redraw();
}

loadMapData() {
    this.loading = true;
    setTimeout(() => {
        this.map_data = null;
        if(this.active) {
            this.map_display.nativeElement.innerHTML = '';
            if(this.map && this.map.indexOf('.svg') >= 0 && this.map.length > 4) {
                this.service.getMap(this.map).then((data: any) => {
                    this.map_data = data;
                    this.setupMap();
                }, (err: any) => {
                    if(window['debug']) console.error(`[WIDGETS] [Map] Error loading map "${this.map}".`);
                    console.error(err);
                });
            } else {
                if(!this.map){
                    if(window['debug']) console.error('[WIDGETS] [Map] Path to map is not valid.');
                } else if(this.map.indexOf('.svg') < 0) {
                    if(window['debug']) console.error('[WIDGETS] [Map] Path to map is not an SVG.');
                } else if(this.map.length > 4) {
                    if(window['debug']) console.error('[WIDGETS] [Map] Path to map is not long enough. It needs to be longer than 4 characters');
                } else {
                    if(window['debug']) console.error(`[WIDGETS] [Map] Unknown error loading map with map path "${this.map}".`);
                }
            }
        } else {
            setTimeout(() => {
                this.loadMapData();
            }, 200);
        }
    }, FADE_TIME);
}

setupMap(){
    this.loading = true;
    if(this.map_data){
        this.map_display.nativeElement.innerHTML = this.map_data;
        this.map_item = this.map_display.nativeElement.children[0];
        this.map_item.style[this.map_orientation] = '100%';
        this.map_item.style.position = 'absolute';
        this.map_item.style.top = '50%';
        this.map_item.style.left = '50%';
        this.zoomed = true;
        this.setupDisabled();
        this.setupPins();
        this.prev_map_styles = [];
        this.map_style_ids = [];
        this.setupStyles();
        this.setupEvents();
        this.resize();
        this.updateBoxes();
        setTimeout(() => {
            this.loading = false;
            this.mapUpdated.emit();
        }, 500);
    }
}

move = {
    x : 0,
    y : 0
}

tapMap(event: any) {
    //Traverse map and return array of clicked elements
    let elems: any[] = [];
    let el = this.map_item;
    if(event && this.map_item) {
        let mbb = this.map_item.getBoundingClientRect();
        console.debug((event.center.x - mbb.left).toString(), (event.center.y - mbb.top).toString());
    }
    elems = this.getItems(event.center, el);
    console.log(elems);
    let e = {
        items: elems,
        event: event
    }
    this.tap.emit(e);
}

getItems(pos: any, el: any) {
    let elems: any[] = []
    for(var i = 0; i < el.children.length; i++){
        let rect = el.children[i].getBoundingClientRect();
        if(pos.y >= rect.top && pos.y <= rect.top + rect.height &&
            pos.x >= rect.left && pos.x <= rect.left + rect.width) {
                if(el.children[i].id) elems.push(el.children[i].id);
                let celems = this.getItems(pos, el.children[i]);
                elems = elems.concat(celems);
            }
        }
        return elems;
    }

    updatePosition(xp: number, yp: number) {
        this.center.x += xp;
        this.center.y += yp;
        this.checkValues();
    }

    moveMap(event: any) {
        if(this.move_timer) {
            this.move.x = event.deltaX;
            this.move.y = event.deltaY;
            clearTimeout(this.move_timer);
            this.move_timer = null;
        }
        if(this.move.x === 0) this.move.x = +event.deltaX;
        if(this.move.y === 0) this.move.y = +event.deltaY;
        let dX = +event.deltaX - +this.move.x;
        dX = (Math.min(this.min, +Math.abs(dX)) * (dX < 0 ? -1 : 1));
        let dY = +event.deltaY - +this.move.y;
        dY = (Math.min(this.min, +Math.abs(dY)) * (dY < 0 ? -1 : 1));

        this.updatePosition(-(dX/this.map_box.width), -(dY/this.map_box.height));
        // Update the display of the map
        this.redraw();
        this.move.x = event.deltaX;
        this.move.y = event.deltaY;
        if(this.min < 100) this.min += 10;
    }

    moveEnd(event: any) {
        if(this.move_timer) {
            clearTimeout(this.move_timer);
            this.move_timer = null;
        }
        this.move_timer = setTimeout(() => {
            this.move.x = this.move.y = 0;
            this.activate = false;
            this.min = 1;
        }, 20);
    }


    dZoom = 1;

    can_change_zoom: boolean = true;
    zoom_timer: any = null;

    updateZoom(zp: number, add: number = 0) {
        this.can_change_zoom = false;
        this._zoom = Math.round((this._zoom + 100) * zp - 100 + add);
        this.checkValues(true);
        this.redraw();
        this.updateBoxes();
        if(this.zoom_timer) {
            clearTimeout(this.zoom_timer);
            this.zoom_timer = null;
        }
        this.zoom_timer = setTimeout(() => {
            this.can_change_zoom = true;
            this.zoom_timer = null;
        });
    }

    startScale(event: any) {
        this.dZoom = event.scale;
    }

    scaleMap(event: any) {
        let scale = event.scale - this.dZoom;
        let dir = scale > 0 ? 1 : -1;
        let value = 1 + dir * Math.max(Math.abs(scale), 0.01) / 2;
        this.updateZoom(value);
        this.dZoom += scale;
    }

    finishScale() {
        this.dZoom = 0;
    }

    zoomIn() {
        this.updateZoom(1.2);
    }

    zoomOut() {
        this.updateZoom(0.8);
    }

    resetZoom() {
        this.center = { x: 0.5, y: 0.5 };
        this.updateZoom(0, -100);
    }

    private redraw(){
        this.draw.animate();
    }

    resize() {
        if(!this.self) return;
        this.content_box = this.self.nativeElement.getBoundingClientRect();
        if(this.map_item && this.map_display) {
            let rect = this.map_item.getBoundingClientRect();
            let md = this.map_display.nativeElement;
        }
        this.updateBoxes();
        this.updateFocus();
        this.loading = false;
    }

    updateAnimation: any;

    setupUpdate() {
        this.updateAnimation = this.a.animation(() => {}, () => {
            if(!this.content_box && this.self) {
                this.content_box = this.self.nativeElement.getBoundingClientRect();
            }
            if(this.map_display && this.content_box && this.map_item) {
                //this.map_box = this.map_display.nativeElement.getBoundingClientRect();
                this.map_box = this.map_item.getBoundingClientRect();
                this.zoomChange.emit(this._zoom);
                let x = (this.map_box.width-this.content_box.width)/this.map_box.width;
                let y = (this.map_box.height-this.content_box.height)/this.map_box.height;
                this.min_center = {
                    x: (-x + 0.5 < -0.05 ? -0.05 : (-x + 0.5 > 0.5 ? 0.5 : -x + 0.5)),
                    y: (-y + 0.5 < -0.05 ? -0.05 : (-y + 0.5 > 0.5 ? 0.5 : -y + 0.5))
                };
                this.max_center = {
                    x: (x + 0.5 > 1.05 ? 1.05 : (x + 0.5 < 0.5 ? 0.5 : x + 0.5)),
                    y: (y + 0.5 > 1.05 ? 1.05 : (y + 0.5 < 0.5 ? 0.5 : y + 0.5)),
                };
                this.redraw();
                if(this.box_update) clearTimeout(this.box_update);
                this.box_update = setTimeout(() => {
                    this.updateBoxes();
                }, 2000);
            }
        });
    }

    updateBoxes() {
        if(this.box_update) clearTimeout(this.box_update);
        this.box_update = setTimeout(() => {
            this.updateAnimation.animate();
        }, 100);
    }

}
