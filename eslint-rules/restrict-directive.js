/**
 * @fileoverview Rule to require angular directive to be restricted to attribute or CSS Class.
 * @author Robert Mujica
 */
"use strict";

var utils = require('./utils/utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = function(context) {
    
    var options = context.options[0] || {};
    var restrictOpt = options.restrict || 'AC';
    var restrictChars = restrictOpt.split('');
    var restrictRegExp = new RegExp('^' + restrictChars.join('?') + '?$');
    var foundDirectives = [];
    var checkedDirectives = [];
    
    return {
        CallExpression: function(node){
            if(utils.isAngularDirectiveDeclaration(node)){
                foundDirectives.push(node);
            }  
        },
        AssignmentExpression: function(node){
            // Only check for literal member property assignments.
            if (node.left.type !== 'MemberExpression') {
                return;
            }
            // Only check setting properties named 'restrict'.
            if (node.left.property.name !== 'restrict') {
                return;
            }
            checkLiteralNode(node.right);  
        },
        Property: function(node){
            if(node.key.name !== 'restrict'){
                return;
            }  
            checkLiteralNode(node.value);
        },
        'Program:exit': function() {
            foundDirectives.filter(function(directive) {
                return checkedDirectives.indexOf(directive) < 0;
            }).forEach(function(directiveNode) {
                context.report(directiveNode, 'Missing directive restriction, it must be restricted to A or C');
            });
        }
    };
    
    function checkLiteralNode(node){
        var directiveNode;
        
        if (node.type !== 'Literal') {
            return;
        }
        
        context.getAncestors().some(function(ancestor) {
            if (utils.isAngularDirectiveDeclaration(ancestor)) {
                directiveNode = ancestor;
                return true;
            }
        });
        
        // The restrict property was not defined inside of a directive.
        if (!directiveNode) {
            return;
        }
        
        if (!restrictRegExp.test(node.value)) {
            context.report(directiveNode, 'Disallowed directive restriction. It must be one of {{allowed}}', {
                allowed: restrictOpt
            });
        }
        
        checkedDirectives.push(directiveNode);
    }
    
};

module.exports.schema = [{
    type: 'object',
    properties: {
        restrict: {
            type: 'string',
            pattern: '^A|C|E|(AC)|(CA)(AE)|(EA)(EC)|(CE)|(AEC)|(ACE)|(EAC)|(CAE)|(ACE)|(AEC)|(CAE)|(ACE)|(AEC)$'
        }
    }
}];